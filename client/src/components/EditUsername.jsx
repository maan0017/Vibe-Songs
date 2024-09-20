import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEmail } from "../store/slices/authSlice.js";
import "bootstrap-icons/font/bootstrap-icons.css";

export const EditUsername = () => {
  const [isNameEditIconOn, setIsNameEditIconOn] = useState(true);
  const [newUsername, setUsername] = useState("");
  const [usernameWidth, setUsernameWidth] = useState(1);
  const usernameSpanRef = useRef(null);
  const usernameInputRef = useRef(null);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => {
    return state.auth;
  });

  const toggleNameEditBtn = (e) => {
    e.preventDefault();
    setUsername(user);
    setIsNameEditIconOn((prevState) => !prevState);
    if (isNameEditIconOn) {
      usernameInputRef.current.focus();
    }
  };
  const handleChangeName = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handleConfirmBtn = (e) => {
    dispatch(updateEmail({ newUsername }));
    setShowConfirmationDialog(false);
    toggleNameEditBtn(e);
  };

  useEffect(() => {
    setUsername(user);
  }, [user]);
  useEffect(() => {
    if (usernameSpanRef.current) {
      setUsernameWidth(usernameSpanRef.current.offsetWidth + 10); // Add a bit of padding
    }
  }, [newUsername]);
  return (
    <div>
      <p className="text-gray-300 flex justify-start items-center mb-2">
        Name :{" "}
        <input
          ref={usernameInputRef}
          value={newUsername}
          onChange={handleChangeName}
          readOnly={isNameEditIconOn}
          style={{ width: usernameWidth }}
          className={
            isNameEditIconOn
              ? "px-1 text-green-600 bg-transparent"
              : "px-1 text-black font-bold"
          }
        />
        <span
          ref={usernameSpanRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            whiteSpace: "pre",
          }}
        >
          {newUsername}
        </span>
        {isNameEditIconOn && (
          <i
            className="bi bi-pencil-square ml-3 hover:cursor-pointer"
            onClick={toggleNameEditBtn}
          ></i>
        )}
        {!isNameEditIconOn && (
          <i
            className="bi bi-x-square-fill ml-3 hover:cursor-pointer"
            style={{ color: "red" }}
            onClick={toggleNameEditBtn}
          ></i>
        )}
        {!isNameEditIconOn && (
          <i
            className="bi bi-check-square-fill ml-3 hover:cursor-pointer"
            style={{ color: "blue" }}
            onClick={() => {
              setShowConfirmationDialog(true);
            }}
          ></i>
        )}
      </p>
      {showConfirmationDialog && (
        <div className="w-[35vw] h-[40vh] bg-black absolute top-20 ring-4">
          <i
            className="bi bi-x-square-fill ml-3 hover:cursor-pointer absolute right-2"
            style={{ color: "red" }}
            onClick={() => {
              setShowConfirmationDialog(false);
            }}
          ></i>
          <p className="text-center font-bold text-2xl text-white mt-[13vh]">
            Confirm Change Username
          </p>
          <button
            type="button"
            className="btn btn-warning text-2xl hover:font-bold hover:ring-2 hover:ring-blue-300 
            flex justify-center items-center mx-auto mt-5"
            onClick={handleConfirmBtn}
          >
            CONFIRM
          </button>
        </div>
      )}
    </div>
  );
};
