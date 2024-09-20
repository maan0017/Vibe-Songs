import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/slices/authSlice.js";
import "bootstrap-icons/font/bootstrap-icons.css";

export const ChangePassword = ({ setDisplayChangePasswordDialog }) => {
  const inputRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [newPasswordNotMatch, setNewPasswordNotMatch] = useState(false);
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleOldPasswordChange = (e) => {
    e.preventDefault();
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    e.preventDefault();
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    e.preventDefault();
    setConfirmNewPassword(e.target.value);
  };

  const handleChagePasswordBtn = async (e) => {
    if (newPassword !== confirmNewPassword) {
      setNewPasswordNotMatch(true);
      return;
    }
    const res = await dispatch(changePassword({ oldPassword, newPassword }));

    if (!error) {
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setDisplayChangePasswordDialog(false);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // if (newPassword !== confirmNewPassword) {
    //   setNewPasswordNotMatch(true);
    // }
    if (newPassword === confirmNewPassword) {
      setNewPasswordNotMatch(false);
    }
  }, [newPassword, confirmNewPassword]);

  return (
    <div
      className="w-[40vw] h-[70vh] bg-black absolute top-[15vh] left-[30vw] ring-4 text-white
    flex flex-col items-center justify-center"
    >
      <i
        className="bi bi-x-square-fill ml-3 hover:cursor-pointer absolute top-2 right-3"
        style={{ color: "red" }}
        onClick={() => {
          setDisplayChangePasswordDialog(false);
        }}
      ></i>
      <div className="flex flex-col justify-center items-center py-2 my-1">
        <label className="mx-1">-Enter Old Password-</label>
        <input
          ref={inputRef}
          type="password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          placeholder="enter old password ..."
          className="w-80 px-2 py-1 text-black"
        />
      </div>
      <div className="flex flex-col justify-center items-center py-2 my-1">
        <label className="mx-2">-Enter New Password-</label>
        <input
          value={newPassword}
          type="password"
          onChange={handleNewPasswordChange}
          placeholder="enter new password ..."
          className="w-80 px-2 py-1 text-black"
        />
      </div>
      <div className="flex flex-col justify-center items-center py-2 my-1">
        <label className="mx-2">-Confirm New Password-</label>
        <input
          value={confirmNewPassword}
          type="password"
          onChange={handleConfirmNewPasswordChange}
          placeholder="confirm new password ..."
          className="w-80 px-2 py-1 text-black"
        />
      </div>
      {newPasswordNotMatch && (
        <div className="alert alert-danger w-80 mt-1" role="alert">
          <p>new passwords did not match !!!</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger w-80 my-1" role="alert">
          <p>Old password is wrong !!!</p>
          <p>{error.message}</p>
        </div>
      )}
      <button
        type="submit"
        className="btn btn-warning flex justify-center items-center my-4
        hover:ring-2 hover:ring-blue-500 hover:font-bold"
        onClick={handleChagePasswordBtn}
      >
        <i className="bi bi-exclamation-diamond-fill px-2"></i>
        Change Password
      </button>
    </div>
  );
};
