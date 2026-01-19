import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// --- CONFIGURE API INSTANCE ---
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BE_URL}`,
  withCredentials: true, // allow httpOnly refresh cookie to be sent
});

// --- HELPERS ---
const ACCESS_KEY = "nibble_access_token";
const USER_KEY = "nibble_user";
const REMEMBER_KEY = "nibble_remember";

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
  if (remember) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

const readStoredUser = () => {
  const s = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
};

const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser());
  const [loading, setLoading] = useState(true); // while trying to restore session
  const [accessToken, setAccessToken] = useState(readStoredAccessToken());

  // --- axios interceptors: register once on mount and clean up ---
  useEffect(() => {
    // Request interceptor
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        const token = readStoredAccessToken() || accessToken;
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      },
      (err) => Promise.reject(err)
    );

    // Response interceptor
    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !original._retry &&
          original.url !== "/auth/refresh"
        ) {
          original._retry = true;
          try {
            const r = await api.post("/api/auth/refresh");
            const newToken = r.data?.accessToken;
            const maybeUser = r.data?.user;
            if (newToken) {
              const remember = localStorage.getItem(REMEMBER_KEY) === "true";
              setAccessToken(newToken);
              storeAccessToken(newToken, remember);
              if (maybeUser) {
                setUser(maybeUser);
                storeUser(maybeUser, remember);
              }
              original.headers["Authorization"] = `Bearer ${newToken}`;
              return api(original);
            }
          } catch (e) {
            // refresh failed -> fall through and reject
            console.warn(
              "Refresh during interceptor failed",
              e?.response?.data || e.message
            );
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject interceptors
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // --- Try to restore session on mount ---
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Try refreshing with cookie (preferred). If refresh returns user, use it.
        try {
          const refreshRes = await api.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true }
          );
          const token = refreshRes.data?.accessToken;
          const maybeUser = refreshRes.data?.user;

          if (token) {
            const remember = localStorage.getItem(REMEMBER_KEY) === "true";
            setAccessToken(token);
            storeAccessToken(token, remember);

            if (maybeUser) {
              setUser(maybeUser);
              storeUser(maybeUser, remember);
            } else {
              // no user returned: fallback to previously stored user
              const stored = readStoredUser();
              if (stored) setUser(stored);
            }

            setLoading(false);
            return;
          }
        } catch (err) {
          // refresh failed (no cookie or invalid). We'll fallback below.
          console.info(
            "Refresh on startup failed (this may be normal if not logged in)."
          );
        }

        // Fallback: restore from stored tokens/user (if present)
        const storedToken = readStoredAccessToken();
        const storedUser = readStoredUser();
        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(storedUser);
        } else {
          // no session
          setUser(null);
          clearStoredAccessToken();
          clearStoredUser();
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- public methods ---
  const login = async ({ email, password, remember = false }) => {
    const res = await api.post("/api/auth/login", {
      email,
      password,
      remember,
    });
    const { accessToken: token, user: u } = res.data;
    setAccessToken(token);
    setUser(u);
    localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");
    storeAccessToken(token, remember);
    storeUser(u, remember);
    return u;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // ignore network errors
    }
    setUser(null);
    setAccessToken(null);
    clearStoredAccessToken();
    clearStoredUser();
    localStorage.removeItem(REMEMBER_KEY);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    api, // export axios instance for convenient API calls
    getAccessToken: () => accessToken || readStoredAccessToken(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
