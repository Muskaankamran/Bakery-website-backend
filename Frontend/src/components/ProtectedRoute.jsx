import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessage } from "./Feedback";

export default function ProtectedRoute({ children }) {
  const { user, loading, authError } = useAuth();
  if (loading) return <LoadingSpinner label="Checking your account…" />;
  if (authError) return <div className="page-container section-space"><ErrorMessage message={authError} /></div>;
  return user ? children : <Navigate to="/login" replace />;
}
