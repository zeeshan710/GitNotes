import React from "react";
import Navbar from "../components/Navbar";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import GistScreen from "../screens/GistScreen";

import { Switch, Route, BrowserRouter as Router, } from "react-router-dom";

const Routes = (props) => {

    return (
        <Router>
            <Navbar />
            <Switch>

                <Route exact path="/" component={LoginScreen} />

                <Route exact path="/GistDetail/:id" component={GistScreen} />

                <Route exact path="/profile" component={ProfileScreen} />

            </Switch>
        </Router >
    );
};

export default Routes;