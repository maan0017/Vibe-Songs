import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SignUp({ setNavbarVisiblity, setToggleSigninSignupPage }) {
  setNavbarVisiblity(false);
  setToggleSigninSignupPage(1);

  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/v1/users/register", {
        username,
        email,
        password,
      })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="form-wrap">
      <h2 className="text-white font-bold text-2xl mb-9 text-center">
        Register Here
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            <strong>Username</strong>
          </label>
          <input
            type="text"
            placeholder="enter name"
            autoComplete="off"
            name="username"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="email">
            <strong>Email</strong>
          </label>
          <input
            type="text"
            placeholder="enter email"
            autoComplete="off"
            name="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="email">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            placeholder="enter password"
            name="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="">
          SIGN UP
        </button>
      </form>
      <p className="mb-1">Already have an account</p>
      <Link to="/login" className="link">
        SING IN
      </Link>
    </div>
  );
}

export default SignUp;
