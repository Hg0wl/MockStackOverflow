import "./index.css";
import {
  login,
  getCSRFToken,
  checkLogin,
} from "../../../services/loginService";
import { useState, useCallback, useEffect } from "react";

//Generate token on login or startup?
const Login = ({ handleSignup, setLoggedInUser, handleQuestions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [incorrectCredentials, setIncorrect] = useState(false);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await getCSRFToken();
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await checkLogin(csrfToken);
      const resLoggedIn = response.data.loggedIn;
      setLoggedIn(resLoggedIn);
      if (resLoggedIn) setUser(response.data.user.username);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, [csrfToken]);

  const handleLogin = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      const response = await login(username, password, csrfToken);

      setLoggedIn(response.data.success);
      setUser(response.data.user.username);
      setLoggedInUser(response.data.user._id);
      setIncorrect(false);
      handleQuestions();
    } catch (error) {
      setIncorrect(true);
    }
  };

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkLoginStatus();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkLoginStatus]);

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
        Don't have an account?&apos;
        <a className="link" onClick={() => handleSignup()}>
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Login;
