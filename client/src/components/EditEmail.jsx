import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import { updateEmail } from "../store/slices/authSlice.js";

export const EditEmail = () => {
  const [isEmailEditIconOn, setIsEmailEditIconOn] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [emailWidth, setEmailWidth] = useState(1);
  const emailSpanRef = useRef(null);
  const emailInputRef = useRef(null);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const dispatch = useDispatch();
  const { email } = useSelector((state) => {
    return state.auth;
  });

  const toggleEmailEditBtn = (e) => {
    e.preventDefault();
    setNewEmail(email);
    setIsEmailEditIconOn((prevState) => !prevState);
    if (isEmailEditIconOn) {
      emailInputRef.current.focus();
    }
  };
  const handleChangeEmail = (e) => {
    e.preventDefault();
    setNewEmail(e.target.value);
  };

  const handleConfirmBtn = (e) => {
    dispatch(updateEmail({ newEmail }));
    setShowConfirmationDialog(false);
    toggleEmailEditBtn(e);
  };

  useEffect(() => {
    setNewEmail(email);
  }, [email]);

  useEffect(() => {
    if (emailSpanRef.current) {
      setEmailWidth(emailSpanRef.current.offsetWidth + 10); // Add a bit of padding
    }
  }, [newEmail]);

  return (
    <div>
      <p className="text-gray-300 flex justify-start items-center mb-2">
        Email :{" "}
        <input
          ref={emailInputRef}
          value={newEmail}
          onChange={handleChangeEmail}
          readOnly={isEmailEditIconOn}
          style={{ width: emailWidth }}
          className={
            isEmailEditIconOn
              ? "px-1 text-green-600 bg-transparent"
              : "px-1 text-black rounded-sm font-bold"
          }
        />
        <span
          ref={emailSpanRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            whiteSpace: "pre",
          }}
        >
          {newEmail}
        </span>
        {isEmailEditIconOn && (
          <i
            className="bi bi-pencil-square ml-3 hover:cursor-pointer"
            onClick={toggleEmailEditBtn}
          ></i>
        )}
        {!isEmailEditIconOn && (
          <i
            className="bi bi-x-square-fill ml-3 hover:cursor-pointer"
            style={{ color: "red" }}
            onClick={toggleEmailEditBtn}
          ></i>
        )}
        {!isEmailEditIconOn && (
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
            Confirm Change Email
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
