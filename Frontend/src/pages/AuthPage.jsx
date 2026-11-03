import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage, showErrorAlert, showSuccessAlert, showValidationAlert } from "../utils/alerts";
import { backendUrl } from "../api";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const googleAuthFailed = new URLSearchParams(location.search).get("google") === "failed";
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      const identifier = form.username.trim();
      if (!identifier || !form.password) {
        await showValidationAlert("Enter your username or email and password.");
        return;
      }
    } else {
      if (!form.username.trim() || !form.email.trim() || !form.password) {
        await showValidationAlert("Username, email, and password are required.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        await showValidationAlert("Enter a valid email address.");
        return;
      }
      if (form.password.length < 6) {
        await showValidationAlert("Your password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const identifier = form.username.trim();
        const credentials = identifier.includes("@")
          ? { email: identifier, password: form.password }
          : { username: identifier, password: form.password };
        const { user } = await login(credentials);
        await showSuccessAlert("Welcome back!", `You are signed in as ${user.username}.`);
        navigate(user.role === "admin" ? "/admin" : location.state?.from || "/", { replace: true });
      } else {
        await register({ username: form.username.trim(), email: form.email.trim(), password: form.password });
        await showSuccessAlert("Your account is ready", "Welcome to Maison Crumb.");
      }
    } catch (requestError) {
      await showErrorAlert("We couldn't complete that request", getApiErrorMessage(requestError, "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <span className="eyebrow">A warm welcome</span>
          <h1>{isLogin ? "Good to have you back." : "Let's make it sweet."}</h1>
          <p>{isLogin ? "Sign in to find your favorites and manage your bag." : "Create an account to save your bakery bag and shop our collection."}</p>
          <div className="auth-side-note"><FiLock /> Your password is never shown or stored in this storefront.</div>
        </div>
        <div className="auth-form-panel">
          <span className="eyebrow">{isLogin ? "Welcome back" : "Join us"}</span>
          <h2>{isLogin ? "Log in" : "Create your account"}</h2>
          {location.state?.notice && <div className="backend-note" role="status">{location.state.notice}</div>}
          {googleAuthFailed && <div className="backend-note" role="alert">Google sign-in could not be completed. Please try again.</div>}
          <form onSubmit={submit} noValidate>
            {!isLogin && (
              <label className="form-field">
                <span>Username</span>
                <input name="username" value={form.username} onChange={change} autoComplete="username" required />
              </label>
            )}
            {isLogin && (
              <label className="form-field">
                <span>Username or email</span>
                <input name="username" value={form.username} onChange={change} autoComplete="username" required />
              </label>
            )}
            {!isLogin && (
              <label className="form-field">
                <span>Email address</span>
                <input type="email" name="email" value={form.email} onChange={change} autoComplete="email" required />
              </label>
            )}
            <label className="form-field">
              <span>Password</span>
              <span className="password-input">
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={change} autoComplete={isLogin ? "current-password" : "new-password"} required />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </span>
            </label>
            <button className="button button-dark auth-submit" type="submit" disabled={loading}>
              {loading ? "One moment…" : isLogin ? "Log in" : "Create account"}
            </button>
          </form>
          <div className="auth-divider"><span>or continue with</span></div>
          <button
            className="google-auth-button"
            type="button"
            onClick={() => window.location.assign(`${backendUrl.replace(/\/+$/, "")}/api/auth/google`)}
          >
            <FcGoogle aria-hidden="true" />
            Continue with Google
          </button>
          <p className="auth-switch">{isLogin ? "New to Maison Crumb?" : "Already have an account?"}{" "}
            <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create an account" : "Log in"}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
