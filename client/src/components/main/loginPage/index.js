import "./index.css";

const Login = ({handleSignup}) => {
  console.log("Login page!");
  return (
    <div className="login-container">
      <img className="login-logo" src="https://i.imgur.com/iC106zH.png"></img>
      <div className="login-panel">
        <div className="login-text">Username</div>
        <input className="login-input"></input>
        <div className="login-text">Password</div>
        <input className="login-input" type="password"></input>
        <button className="login-form-button">Login</button>
      </div>
      <div className="link-prompt">
        Don't have an account? <a className="link" onClick={() => handleSignup()}>Sign Up</a>
      </div>
    </div>
  );
};

export default Login;
