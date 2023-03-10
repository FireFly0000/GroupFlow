import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const LoginPage = (props) => {
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <section className="auth">
      <div className="Auth-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login </h1>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Enter Username" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter Password" />
        <br></br>
        <button className="auth-btn" type="submit">Login</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch('register')}> Don't have an account? Register</button>
      </div>
    </section>
  );
};

export default LoginPage;