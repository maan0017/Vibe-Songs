import { useState, useEffect, useRef } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Navbar.css";
import searchIcon from "../../assets/icons/search.png";

function Navbar({
  navbarVisiblity,
  setNavbarVisiblity,
  setIsSearchFocused,
  navbarData,
  setNavbarData,
  toggleSigninSingupPage,
}) {
  const inputRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  const handleSearchInputChange = (e) => {
    e.preventDefault;
    setNavbarData(e.target.value);
  };
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "/") {
      inputRef.current.focus();
      setNavbarData((data) => data.replace("/", ""));
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  useEffect(() => {
    setNavbarData((data) => data.replace("/", ""));
  }, [setNavbarData, navbarData]);

  return (
    <>
      <nav className="navbar">
        <div>
          <Link to="/home" className="site-title">
            <h5>vibeSongs</h5>
          </Link>
        </div>
        {navbarVisiblity && (
          <div className="search-bar">
            <input
              ref={inputRef}
              type="search"
              value={navbarData}
              placeholder="seacrch music here...."
              onChange={handleSearchInputChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="text-black px-1"
            />
            <div className="search-icon-container">
              <img src={searchIcon} alt="search-icon" className="search-btn" />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center font-mono">
          <ul>
            {!isAuthenticated && toggleSigninSingupPage === 0 && (
              <CustomLink to="/login">signin</CustomLink>
            )}

            {!isAuthenticated && toggleSigninSingupPage === 1 && (
              <CustomLink to="/register">singup</CustomLink>
            )}

            {isAuthenticated && (
              <CustomLink to="/dashboard" className="text-blue-700">
                {user}
              </CustomLink>
            )}

            <CustomLink to="/settings">settings</CustomLink>
            {/* <CustomLink to="/songs-credentials">songs credientals</CustomLink> */}
          </ul>
        </div>
      </nav>
      <hr />
    </>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  return (
    <li className={`px-1 ${isActive ? "active" : ""}`}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
