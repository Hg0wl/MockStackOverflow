import "./index.css";
import {
  login,
  getCSRFToken,
} from "../../../services/loginService";
import { useState, useCallback, useEffect } from "react";

//Generate token on login or startup?
const Login = ({ handleSignup, setLoggedInUser, handleQuestions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [incorrectCredentials, setIncorrect] = useState(false);

  /**
   * Gets the csrf token from the serveer and sets the csrfToken state
   */
  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await getCSRFToken();
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }, []);

  /**
   * Sends a request to the server with the inputted username and password
   * If they are correct, loggs that user in and redirects to the homepage
   * If they are not, renders an error message to the user
   */
  const handleLogin = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      const response = await login(username, password);

      if (response.data) {
        setLoggedInUser(response.data.user._id);
        setIncorrect(false);
        handleQuestions();
      } else {
        setIncorrect(true);
      }
    } catch (error) {
      setIncorrect(true);
    }
  };

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken]);

  return (
    <div className="login-container">
      <img className="login-logo" src="https://i.imgur.com/iC106zH.png"></img>
      <div className="login-panel">
        <div className="login-text">Username</div>
        <input
          className="login-input"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <div className="login-text">Password</div>
        <input
          className="login-input"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div className="incorrect-credentials">
          {incorrectCredentials ? "Incorrect username or password" : ""}
        </div>
        <button className="login-form-button" onClick={() => handleLogin()}>
          Login
        </button>
      </div>
      <div className="link-prompt">
        Don't have an account?{" "}
        <a className="link" onClick={() => handleSignup()}>
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Login;
