import "./index.css";

const LoginButtons = ({ handleLogin, handleSignup }) => {
  return (
    <div className="login-buttons">
      <button
        id="login-button"
        className="clear-button"
        onClick={() => handleLogin()}
      >
        Login
      </button>
      <button
        id="login-button"
        className="filled-button"
        onClick={() => handleSignup()}
      >
        Signup
      </button>
    </div>
  );
};

export default LoginButtons;
