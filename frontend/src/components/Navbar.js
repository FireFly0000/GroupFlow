import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LoginPage from "../views/LoginPage"
import Register from "../views/RegisterPage";
import "../App.css"

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [Form, setForm] = useState("login");
  const history = useHistory();

  const toggleForm = (formName) =>{
    setForm(formName)
  }
  const RouteChange = (np)=> {
    let path = np;
    console.log(path)
    history.push(path)
  }
  return (
    <div>
      <div>
        <nav className="nav-bar">
          <div className="nav-bar-left-side">
            <button className="app-name">GroupFlow</button>
          </div>  
          {
          user ? 
          <div className="nav-bar-right-side">
            <button className="home-nav-btn" onClick={logoutUser}>Logout</button>
            <button className="home-nav-btn" onClick={()=>RouteChange('/home')}> Home </button>
            <button className="home-nav-btn" onClick={()=>RouteChange('/protected')}> Protected </button>
          </div>
          :
          <></>
          } 
        </nav>
        <div>
          {user ? (
            <> </>
          ) : (
            <div className="auth-form">
              {Form === 'login' ? <LoginPage onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm}/>} 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;