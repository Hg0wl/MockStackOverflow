import "./index.css";
import { useState, useCallback, useEffect } from "react";
import { signup } from "../../../services/signupService";

const Signup = ({ handleLogin, setLoggedInUser, handleQuestions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      if (password == confirmPassword) {
        const response = await signup(username, password);
        console.log(response);
        if (response.success) {
          setLoggedInUser(response.user._id);
          handleQuestions();
        } else {
          setErrorMessage("A user with that username already exists");
        }
      } else {
        setErrorMessage("Passwords don't match");
      }
    } catch (error) {
      setErrorMessage("A user with that username already exists");
    }
  };

  return (
    <div className="login-container">
      <img className="login-logo" src="https://i.imgur.com/iC106zH.png"></img>
      <div className="login-panel">
        <div className="login-text">Username</div>
        <input
          id="signupUsernameInput"
          className="login-input"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <div className="login-text">Password</div>
        <input
          id="signupPasswordInput"
          className="login-input"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div className="login-text">Confirm Password</div>
        <input
          id="signupPasswordConfirm"
          className="login-input"
          type="password"
          onChange={(e) => setConfirm(e.target.value)}
        ></input>
        <div id="signupErr" className="incorrect-credentials">{errorMessage}</div>
        <button className="login-form-button" onClick={() => handleSignup()}>
          Signup
        </button>
      </div>
      <div className="link-prompt">
        Already have an account?{" "}
        <a className="link" onClick={() => handleLogin()}>
          Login
        </a>
      </div>
    </div>
  );
};

export default Signup;
