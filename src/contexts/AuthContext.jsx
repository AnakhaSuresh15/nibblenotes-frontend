import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// --- CONFIGURE API INSTANCE ---
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BE_URL}`,
  withCredentials: true,
});

// --- STORAGE KEYS ---
const ACCESS_KEY = "nibble_access_token";
const USER_KEY = "nibble_user";
const REMEMBER_KEY = "nibble_remember";

// --- HELPERS ---
const readStoredAccessToken = () =>
  localStorage.getItem(ACCESS_KEY) || sessionStorage.getItem(ACCESS_KEY);

const storeAccessToken = (token, remember) => {
  if (remember) localStorage.setItem(ACCESS_KEY, token);
  else sessionStorage.setItem(ACCESS_KEY, token);
};

const clearStoredAccessToken = () => {
  localStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
};

const storeUser = (user, remember) => {
  if (!user) return;
  const s = JSON.stringify(user);
  remember
    ? localStorage.setItem(USER_KEY, s)
    : sessionStorage.setItem(USER_KEY, s);
};

const readStoredUser = () => {
  const s = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
};

const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const AuthContext = createContext(null);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser());
  const [accessToken, setAccessToken] = useState(readStoredAccessToken());
  const [loading, setLoading] = useState(true);

  // 🔴 LOGOUT HELPER (used in interceptor too)
  const hardLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    setAccessToken(null);
    clearStoredAccessToken();
    clearStoredUser();
    localStorage.removeItem(REMEMBER_KEY);
  };

  // --- INTERCEPTORS ---
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      const token = readStoredAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // If refresh itself fails → logout
        if (original.url?.includes("/auth/refresh")) {
          await hardLogout();
          return Promise.reject(error);
        }

        // If refresh already in progress → queue request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                original.headers.Authorization = `Bearer ${token}`;
                resolve(api(original));
              },
              reject,
            });
          });
        }

        original._retry = true;
        isRefreshing = true;

        try {
          const r = await api.post("/auth/refresh");
          const newToken = r.data?.accessToken;
          const maybeUser = r.data?.user;

          if (!newToken) throw new Error("No token from refresh");

          const remember = localStorage.getItem(REMEMBER_KEY) === "true";
          setAccessToken(newToken);
          storeAccessToken(newToken, remember);

          if (maybeUser) {
            setUser(maybeUser);
            storeUser(maybeUser, remember);
          }

          api.defaults.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);

          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch (err) {
          processQueue(err, null);
          await hardLogout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      },
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // --- STARTUP REFRESH (RUN ONCE) ---
  useEffect(() => {
    (async () => {
      try {
        const res = await api.post("/auth/refresh");
        const token = res.data?.accessToken;
        const maybeUser = res.data?.user;

        if (token) {
          const remember = localStorage.getItem(REMEMBER_KEY) === "true";
          setAccessToken(token);
          storeAccessToken(token, remember);

          if (maybeUser) {
            setUser(maybeUser);
            storeUser(maybeUser, remember);
          }
        } else {
          await hardLogout();
        }
      } catch {
        await hardLogout();
      } finally {
        setLoading(false); // 🔴 ALWAYS stop loading
      }
    })();
  }, []);

  // --- PUBLIC METHODS ---
  const login = async ({ email, password, remember }) => {
    const res = await api.post("/auth/login", {
      email,
      password,
      remember,
    });

    const { accessToken: token, user } = res.data;
    setAccessToken(token);
    setUser(user);
    localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");
    storeAccessToken(token, remember);
    storeUser(user, remember);
    return user;
  };

  const value = {
    user,
    loading,
    login,
    logout: hardLogout,
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
