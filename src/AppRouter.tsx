// import { RcFile } from 'antd/lib/upload';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import App from "./App";
import Login from "./login";
import Register from "./register";
import { auth } from "./firebase";
import Header from "./components/Header";

interface AppRouterProps {
  history?: any;
}

const AppRouter: React.FC<AppRouterProps> = (props) => {
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    auth?.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <BrowserRouter>
      {user && (
        <>
          <Header login={true} />
          <Switch>
            <Route exact path="/" component={App} />
            <Redirect path="*" to="/" />
          </Switch>
        </>
      )}
      {!user && (
        <>
          <Header login={false} />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Redirect path="*" to="/login" />
          </Switch>
        </>
      )}
    </BrowserRouter>
  );
};

export default AppRouter;
