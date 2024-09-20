import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../store/slices/authSlice.js";

function SignIn({ setNavbarVisiblity, setToggleSigninSignupPage }) {
  setNavbarVisiblity(false);
  setToggleSigninSignupPage(0);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ id, password }));
  };
  return (
    <div className="form-wrap">
      <h2 className="text-white font-bold text-2xl mb-9 text-center">
        Sign In
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">
            <strong>id</strong>
          </label>
          <input
            type="text"
            placeholder="enter email / username"
            autoComplete="off"
            name="id"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="id">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            placeholder="enter password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {error && (
          <p className="bg-red-500 px-4 py-2 my-2 rounded-md text-center">
            {error}
          </p>
        )}
        <button type="submit" className="">
          Login
        </button>
        {status === "loading" && <p>Logging in...</p>}
      </form>
      <p>Create an account</p>
      <Link to="/register" className="link">
        SIGN UP
      </Link>
    </div>
  );
}

export default SignIn;
