import React, { useState, useEffect, useRef } from "react";
import "../CSS/Navbar.css";
import "../CSS/NavbarDropdown.css"; // ✅ New CSS
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ import auth context
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";


function Navbar() {
  const { cart } = useCart();
  const { user, logout, getFirstName } = useAuth(); // ✅ get auth
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/") setActiveLink("Home");
    else if (currentPath === "/collection") setActiveLink("Collection");
    else if (currentPath === "/about") setActiveLink("About");
    else if (currentPath === "/contact") setActiveLink("Contact");
    else if (currentPath === "/cart") setActiveLink("Cart");
  }, []);

  const handleClick = (linkName) => {
    setActiveLink(linkName);
  };

  // ✅ calculate total items (distinct items count)
  const cartCount = cart.length;

  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch();


  useEffect(() => {
    function handleClickOutside(e) {
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/" onClick={() => handleClick("Home")}>
          Driply
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={`nav-link ${activeLink === "Home" ? "selected-link" : ""}`}
                to="/"
                onClick={() => handleClick("Home")}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${activeLink === "Collection" ? "selected-link" : ""}`}
                to="/collection"
                onClick={() => handleClick("Collection")}
              >
                Collection
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${activeLink === "About" ? "selected-link" : ""}`}
                to="/about"
                onClick={() => handleClick("About")}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${activeLink === "Contact" ? "selected-link" : ""}`}
                to="/contact"
                onClick={() => handleClick("Contact")}
              >
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="left d-flex align-items-center gap-4">

            {/* 🔍 SEARCH */}
            <div ref={searchRef} className={`nav-search ${searchOpen ? "open" : ""}`}>
              <button
                className="search-btn"
                onClick={() => {
                  if (!searchOpen) {
                    setSearchOpen(true);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  } else {
                    // if open, treat as submit when there's a query
                    if (localSearch.trim()) {
                      setSearchQuery(localSearch); // update context
                      navigate(`/collection?search=${encodeURIComponent(localSearch)}`);
                      setSearchOpen(false);
                    } else {
                      setSearchOpen(false);
                    }
                  }
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>

              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search products"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && localSearch.trim()) {
                    setSearchQuery(localSearch); // update context
                    navigate(`/collection?search=${encodeURIComponent(localSearch)}`);
                    setSearchOpen(false);
                  }
                }}
              />
            </div>

            {/* 👤 USER DROPDOWN */}
            <div className="user-dropdown-container">
              <i className="sr fa-regular fa-user user-icon"></i>
              <div className="user-dropdown-menu">
                {user ? (
                  <>
                    <p className="dropdown-username">Hello, {getFirstName()}</p>
                    <NavLink to="/orders" className="dropdown-item">My Orders</NavLink>
                    <button onClick={() => { logout(); navigate("/"); }} className="dropdown-item logout-btn">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="dropdown-item">Login</NavLink>
                    <NavLink to="/signup" className="dropdown-item">Sign Up</NavLink>
                    <div style={{ borderTop: "1px solid #eee", margin: "5px 0" }}></div>
                    <NavLink to="/orders" className="dropdown-item">My Orders / Track</NavLink>
                  </>
                )}
              </div>
            </div>

            {/* 🛒 CART */}
            <NavLink
              to="/cart"
              className={`btn-1 position-relative border-0 bg-transparent ${activeLink === "Cart" ? "selected-link" : ""
                }`}
            >
              <i className="fa-solid fa-cart-shopping"></i>

              {cartCount > 0 && (
                <span className="cart-99 position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </NavLink>

          </div>



        </div>
      </div>
    </nav>
  );
}

export default Navbar;