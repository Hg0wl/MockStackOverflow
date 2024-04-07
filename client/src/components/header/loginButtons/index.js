import "./index.css";

const LoginButtons = () => {
    return (
      <div className="login-buttons">
        <button id="login-button" className="clear-button">
          Login
        </button>
        <button id="login-button" className="filled-button">
          Signup
        </button>
      </div>
    );
}

export default LoginButtons