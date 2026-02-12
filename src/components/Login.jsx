import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password, remember });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary h-full w-full flex items-center justify-center text-white">
      <form
        className="max-w-md md:w-full py-10 px-6 bg-login-card-bg rounded-lg shadow-lg flex flex-col justify-center items-center text-text"
        onSubmit={submit}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to NibbleNotes
        </h2>
        <div className="mb-4 md:w-11/12 w-full">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:placeholder-zinc-400"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="mb-6 md:w-11/12 w-full relative">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:placeholder-zinc-400"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3/4 -translate-y-1/2 text-text cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          )}
        </div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span className="ml-2 text-sm">Remember me</span>
        </label>
        <button
          className="p-3 bg-accent rounded-lg md:w-11/12 w-full hover:brightness-90 mb-8 cursor-pointer transition-all duration-200 flex justify-center items-center"
          disabled={loading}
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <span className="text-sm">
          New to <span className="text-[#de7e72]">NibbleNotes</span>? Register{" "}
          <Link className="text-blue-500 underline" to="/register">
            here
          </Link>
        </span>
        {/* Future Feature: */}
        {/* <span className="text-sm">Login as a Guest</span> */}
      </form>
    </div>
  );
};

export default Login;
