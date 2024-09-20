import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice.js";
import { useEffect, useState } from "react";
import { EditUsername } from "../components/EditUsername.jsx";
import { EditEmail } from "../components/EditEmail.jsx";
import { ChangePassword } from "../components/ChangePassword.jsx";

import "bootstrap-icons/font/bootstrap-icons.css";

const DashboardPage = ({ setNavbarVisiblity }) => {
  setNavbarVisiblity(false);

  const [displayChangePasswordDialog, setDisplayChangePasswordDialog] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  const handleChagePasswordBtn = (e) => {
    e.preventDefault();
    setDisplayChangePasswordDialog(true);
  };

  const handleLogoutBtn = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/login"); // Redirect to login page after logout
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="overflow-y-hidden">
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-[50vw] h-[55vh] mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter
      backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center"
        >
          <h2
            className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-violet-500 to-blue-400 
      text-transparent bg-clip-text"
          >
            Dashboard
          </h2>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-[36vw] mt-3 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-3 text-center">
                Profile Informaiton
              </h3>
              <EditUsername />
              <EditEmail />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="btn btn-secondary mx-auto p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 
              flex justify-center items-center"
              onClick={handleChagePasswordBtn}
            >
              <i className="bi bi-lock-fill pr-3"></i>
              <p>Change Password</p>
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-[50vw] mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter
      backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 flex justify-center items-center"
        >
          <button onClick={handleLogoutBtn} className="btn btn-danger">
            Log Out
          </button>
        </motion.div>
      </div>
      {displayChangePasswordDialog && (
        <ChangePassword
          setDisplayChangePasswordDialog={setDisplayChangePasswordDialog}
        />
      )}
    </div>
  );
};

export default DashboardPage;
