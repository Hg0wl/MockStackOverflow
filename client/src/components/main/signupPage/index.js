import "./index.css";
import { useState, useEffect, useCallback } from "react";
import { signup } from "../../../services/signupService";
import { getCSRFToken } from "../../../services/loginService";
import { sanitize } from "../../../tool";

const Signup = ({ handleLogin, setLoggedInUser, handleQuestions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await getCSRFToken();
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }, []);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken]);

  /**
   * Handles signing up as a new user
   * Sends inputted username and password to server if inputted passwords are correct
   * If the server sends back a successful response, redirects to home page and logs user in
   * Otherwise, displays appropreate error message.
   */
  const handleSignup = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      setUsername(sanitize(username));
      setPassword(sanitize(password));
      setConfirm(sanitize(confirmPassword))

      if (password == confirmPassword && username != "" && password != "") {
        const response = await signup(username, password);

        if (response.success) {
          setLoggedInUser(response.user._id);
          handleQuestions();
        } else {
          setErrorMessage("A user with that username already exists");
        }
      } else if (password != confirmPassword) {
        setErrorMessage("Passwords don't match");
      } else if (username == "" || password == "") {
        setErrorMessage("Username and password cannot be empty")
      }
    } catch (error) {
      setErrorMessage("A user with that username already exists");
    }
  };

  return (
    <div className="login-container">
      <img className="login-logo" src="https://i.imgur.com/iC106zH.png" alt=""></img>
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
        <div id="signupErr" className="incorrect-credentials">
          {errorMessage}
        </div>
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
