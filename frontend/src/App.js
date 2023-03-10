import React from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./views/LoginPage";
import Register from "./views/RegisterPage";
import ProtectedPage from "./views/ProtectedPage";
import Home from "./views/Home";
import Tasks from "./views/tasks";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Navbar />
          <Switch>
            <PrivateRoute component={ProtectedPage} path="/protected" exact />
            <Route component={Login} path="/login" />
            <Route component={Register} path="/register" />
            <PrivateRoute component={Home} path="/home" />
            <PrivateRoute component={Tasks} path="/tasks" />  
          </Switch>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;