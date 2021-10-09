import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, } from "react-router-dom";
import { AuthProvider } from "./components/auth";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";


class App extends Component {
  render() {
    return (<AuthProvider>
      <Router>
      
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login">
            <Login />
        </Route>
        <Route exact path="/signup">
            <Signup />
        </Route>
        <Route exact path="/home">
            <Home />
        </Route>
     
    </Router>
    </AuthProvider>);
  }
}

export default App;