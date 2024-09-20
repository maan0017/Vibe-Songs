import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Header/Navbar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import EnterSongsCriteria from "./pages/EnterSongsCriteria.jsx";

function App() {
  const [toggleSigninSingupPage, setToggleSigninSignupPage] = useState(0);
  const [navbarVisiblity, setNavbarVisiblity] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [navbarData, setNavbarData] = useState("");
  return (
    <>
      <Navbar
        navbarVisiblity={navbarVisiblity}
        setNavbarVisiblity={setNavbarVisiblity}
        setIsSearchFocused={setIsSearchFocused}
        navbarData={navbarData}
        setNavbarData={setNavbarData}
        toggleSigninSingupPage={toggleSigninSingupPage}
      />
      <div className="Container">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setNavbarVisiblity={setNavbarVisiblity}
                isSearchFocused={isSearchFocused}
                navbarData={navbarData}
              />
            }
          />
          <Route
            path="/home"
            element={
              <HomePage
                setNavbarVisiblity={setNavbarVisiblity}
                isSearchFocused={isSearchFocused}
                navbarData={navbarData}
              />
            }
          />
          <Route
            path="/login"
            element={
              <SignIn
                setNavbarVisiblity={setNavbarVisiblity}
                setToggleSigninSignupPage={setToggleSigninSignupPage}
              />
            }
          />
          <Route
            path="/register"
            element={
              <SignUp
                setNavbarVisiblity={setNavbarVisiblity}
                setToggleSigninSignupPage={setToggleSigninSignupPage}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<DashboardPage setNavbarVisiblity={setNavbarVisiblity} />}
          />
          <Route
            path="/settings"
            element={<SettingsPage setNavbarVisiblity={setNavbarVisiblity} />}
          />
          <Route path="/songs-credentials" element={<EnterSongsCriteria />} />
          <Route path="*" element={<h1>404,page not found</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
