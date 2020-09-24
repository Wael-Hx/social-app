import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./Store";
import Login from "./components/auth/Login";
import Navbar from "./components/navigation/Navbar";
import Register from "./components/auth/Register";
import AddPost from "./components/home/AddPost";
import Home from "./components/home/Home";
import "./App.css";

function App() {
  return (
    <>
      <Provider store={Store}>
        <Router>
          <Route path="/" component={Navbar} />
          <Switch>
            <Route exact path="/auth" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/add" component={AddPost} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </Provider>
    </>
  );
}

export default App;
