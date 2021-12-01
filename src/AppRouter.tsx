import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import firebase from "firebase";
import App from "./App";
import Login from "./pages/login";
import Register from "./pages/register";
import { auth } from "./firebase";
import Header from "./components/Header";
import VideoList from "./pages/VideoList";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";

interface AppRouterProps {
  history?: any;
}

const AppRouter: React.FC<AppRouterProps> = ({ history }) => {
  const [user, setUser] = useState<any>("");
  const [registerNum, setRegisterNum] = useState<string>("");

  auth?.onAuthStateChanged((user) => {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .where("uid", "==", user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const registerNum = doc.id;
            setRegisterNum(registerNum);
          });
        })
        .catch((error) => {
          console.log("Error getting registerNum: ", error);
        });
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return (
    <BrowserRouter>
      {user && (
        <div style={{ backgroundColor: "#f7f7f7" }}>
          <Header login={true} />
          <Switch>
            <Route
              exact
              path="/"
              render={() => <VideoList user={user} registerNum={registerNum} />}
            />
            <Route
              exact
              path="/video/:videoid"
              render={({ match }) => (
                <App
                  user={user}
                  registerNum={registerNum}
                  match={match}
                  history={history}
                />
              )}
            />
            <Route path="/admin" component={Admin} />
            <Redirect path="*" to="/" />
          </Switch>
          <Footer />
        </div>
      )}
      {!user && (
        <div style={{ backgroundColor: "#f7f7f7" }}>
          <Header login={false} />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/admin" component={Admin} />
          </Switch>
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
};

export default AppRouter;
