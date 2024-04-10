import "./index.css";

const Signup = ({ handleLogin }) => {
  return (
    <div className="login-container">
      <img className="login-logo" src="https://i.imgur.com/iC106zH.png"></img>
      <div className="login-panel">
        <div className="login-text">Username</div>
        <input className="login-input"></input>
        <div className="login-text">Password</div>
        <input className="login-input" type="password"></input>
        <div className="login-text">Confirm Password</div>
        <input className="login-input" type="password"></input>
        <button className="login-form-button">Signup</button>
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
