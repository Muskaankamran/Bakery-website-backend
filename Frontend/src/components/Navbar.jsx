import { useState } from "react";
import { FiMenu, FiMoon, FiSearch, FiShoppingBag, FiSun, FiUser, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import { confirmLogout } from "../utils/alerts";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    const term = search.trim();
    navigate(term ? `/shop?search=${encodeURIComponent(term)}` : "/shop");
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;
    logout();
    navigate("/login", { state: { notice: "You are signed out in this browser session. This backend has no logout endpoint, so its HttpOnly cookie remains valid until it expires." } });
  };

  return (
    <header className="site-header">
      <div className="announcement">Small-batch baking, made with care <span>·</span> Fresh from our kitchen</div>
      <div className="navbar-inner page-container">
        <Link to="/" className="brand" aria-label="Maison Crumb home">
          <span className="brand-monogram">M</span>
          <span className="brand-wordmark">maison<span>crumb</span><small>BAKERY & PATISSERIE</small></span>
        </Link>

        <nav className={`primary-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          {user?.role === "admin" && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</NavLink>}
          <a href="/#about" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>

        <div className="nav-actions">
          <form className="nav-search" role="search" onSubmit={submitSearch}>
            <FiSearch aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a treat" aria-label="Search products" />
          </form>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
            <span>{theme === "light" ? "Light mode" : "Dark mode"}</span>
          </button>
          <div className="account-menu">
            <button type="button" className="icon-action account-trigger" aria-label={user ? `Account for ${user.username}` : "Account"} onClick={() => navigate(user ? "/profile" : "/login")}>
              <FiUser aria-hidden="true" />
              <span>{loading ? "…" : user ? user.username : "Account"}</span>
            </button>
            {user && (
              <div className="account-dropdown">
                <Link to="/profile"><FiUser /> My profile</Link>
                <button type="button" onClick={handleLogout}>Sign out</button>
              </div>
            )}
          </div>
          <Link to="/cart" className="icon-action bag-action" aria-label={`Shopping bag, ${cartCount} items`}>
            <FiShoppingBag aria-hidden="true" /><span>Bag</span>
            <span className="bag-count">{cartCount}</span>
          </Link>
          {!user && !loading && <div className="nav-auth-links"><Link to="/login">Log in</Link><Link to="/register" className="signup-link">Sign up</Link></div>}
          <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
