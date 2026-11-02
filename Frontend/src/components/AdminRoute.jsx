import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessage } from "./Feedback";

export default function AdminRoute({ children }) {
  const { user, loading, authError } = useAuth();
  if (loading) return <LoadingSpinner label="Verifying administrator access…" />;
  if (authError) return <div className="page-container section-space"><ErrorMessage message={authError} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? children : <Navigate to="/" replace />;
}
