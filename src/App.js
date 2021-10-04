import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { AuthProvider } from "./components/auth";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";
import Chatscreen from "./components/chatscreen";
import Welcomeboard from "./components/welcomeboard";

class App extends Component {
  render() {
    return (<AuthProvider>
      <Router>
      <Switch>
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
      </Switch>
    </Router>
    </AuthProvider>);
  }
}

export default App;