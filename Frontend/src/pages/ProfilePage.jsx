import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { confirmLogout } from "../utils/alerts";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;
    logout();
    navigate("/login", { state: { notice: "You are signed out in this browser session. This backend has no logout endpoint, so its HttpOnly cookie remains valid until it expires." } });
  };

  return (
    <div className="page-container section-space profile-page">
      <div className="profile-card">
        <div className="profile-heading"><span className="profile-avatar"><FiUser /></span><div><span className="eyebrow">Your account</span><h1>Lovely to see you, {user?.username}</h1></div></div>
        <div className="profile-fields">
          <div><span>Username</span><strong>{user?.username}</strong></div>
          <div><span>Email</span><strong>{user?.email}</strong></div>
          <div><span>Account role</span><strong>{user?.role}</strong></div>
        </div>
        <button type="button" className="button button-outline" onClick={signOut}><FiLogOut /> Sign out</button>
        <div className="backend-note profile-note">The current API does not include a logout endpoint or order-history endpoint. Signing out here clears the storefront session only; the HttpOnly login cookie cannot be revoked by this frontend.</div>
      </div>
    </div>
  );
}
