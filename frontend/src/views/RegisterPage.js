import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(username, password, password2, email);
  };

  return (
    <section className="auth">
      <div className="Auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            onChange={e => setPassword2(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <p>{password2 !== password ? "Passwords do not match" : ""}</p>
        <button className="auth-btn">Register</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch('login')}> Already have an account? login</button>
      </div>
    </section>
  );
}

export default Register;