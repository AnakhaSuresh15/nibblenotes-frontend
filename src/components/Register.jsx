// src/pages/Register.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { api } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true); // optional
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim()) return "Email is required";
    // simple email regex
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationErr = validate();
    if (validationErr) return setError(validationErr);

    setLoading(true);
    try {
      const payload = { firstName, lastName, email, password };
      const res = await api.post("/auth/register", payload);
      setSuccess("Registration successful. Redirecting to login...");
      // Option A: redirect to login
      setTimeout(() => navigate("/login", { replace: true }), 900);

      // Option B: auto-login after registration (uncomment if you want auto-login)
      /*
      const loginRes = await api.post('/auth/login', { email, password, remember: true });
      const { accessToken, user } = loginRes.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      // then navigate to protected route
      navigate('/', { replace: true });
      */
    } catch (err) {
      // read backend error message if present
      const msg =
        err?.response?.data?.message || err.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary h-full w-full flex items-center justify-center text-white min-h-screen p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md p-6 bg-login-card-bg rounded-lg shadow-lg flex flex-col justify-center items-center md:min-w-1/3 w-11/12 text-text"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        {success && (
          <div className="mb-4 text-sm text-green-400">{success}</div>
        )}

        <div className="mb-4 w-11/12">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:placeholder-zinc-400"
            placeholder="Enter your first name"
          />
        </div>

        <div className="mb-4 w-11/12">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:placeholder-zinc-400"
            placeholder="Enter your last name"
          />
        </div>

        <div className="mb-4 w-11/12">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:placeholder-zinc-400"
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>

        <div className="mb-6 w-11/12 relative">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:placeholder-zinc-400"
            placeholder="Enter your password"
            autoComplete="new-password"
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

        <label className="flex items-center mb-4 w-11/12">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">
            I agree to the Terms and Privacy Policy
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !agree}
          className="p-3 bg-accent text-text rounded-lg w-11/12 hover:brightness-90 mb-2 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="text-sm mt-2">
          Already registered?{" "}
          <Link to="/login" className="text-blue-400 underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
