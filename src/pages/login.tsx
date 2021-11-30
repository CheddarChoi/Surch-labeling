import React, { useState } from "react";
import { Link } from "react-router-dom";

import firebase from "../firebase";
import "./Auth.css";
import { Alert, Input } from "antd";

const styles = {
  fixSize: {
    height: "600px",
    width: "350px",
    borderColot: "black",
  },
  margin: {
    marginBottom: "40px",
  },
};
interface LoginProps {
  history?: any;
}
const Login: React.FC<LoginProps> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cautionMessage, setCautionMessage] = useState<string>("");

  const handleChange = (e: any) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        props.history.push("/");
      })
      .catch((error) => {
        setCautionMessage(error.message);
      });
  };

  return (
    <div className="auth--container" style={styles.fixSize}>
      <h2 style={styles.margin}>Login to your account</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <Input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="password">Enter password</label>
        <Input
          type="password"
          name="password"
          id="password"
          value={password}
          style={styles.margin}
          onChange={handleChange}
        />
        {cautionMessage !== "" && (
          <Alert
            message={cautionMessage}
            style={{ marginBottom: "24px" }}
            type="error"
          />
        )}
        <button
          className="general-submit"
          style={styles.margin}
          children="Get Started"
        />
        <p>
          Don't have an account?{" "}
          <Link className="register-btn" to="/register">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
