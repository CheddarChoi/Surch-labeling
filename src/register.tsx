import React, { useState } from "react";
import firebase from "./firebase";
import { Link } from "react-router-dom";
import "./Auth.css";

// var db = firebase.firestore();

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
interface RegisterProps {
  history?: any;
}
const Register: React.FC<RegisterProps> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [error, setError] = useState<any>(null);

  const handleChange = (e: any) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    }
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // const { email, username, password, gender, birth } = this.state;
    console.log("submit started");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user!
          .updateProfile({ displayName: username })
          .then(() => {
            //Update UserDB here
          })
          .catch((error) => {
            setError({ error });
          });
        console.log("Register success");
        props.history.push("/");
      })
      .catch((error) => {
        setError({ error });
      });
  };
  return (
    <div className="auth--container" style={styles.fixSize}>
      <h2 style={styles.margin}>Register your account</h2>
      {error && <p className="error-message">{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={handleChange}
        />
        <label htmlFor="password">Choose a password</label>
        <input
          type="password"
          name="password"
          id="password"
          style={styles.margin}
          value={password}
          onChange={handleChange}
        />
        <button
          className="general-submit"
          style={styles.margin}
          children="Get Started"
        />
        <p>
          Already have an account?{" "}
          <Link className="login-btn" to="/login">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
