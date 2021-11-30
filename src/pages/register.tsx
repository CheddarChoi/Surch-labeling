import React, { useState } from "react";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import "./Auth.css";
import { Alert, Input } from "antd";

// var db = firebase.firestore();

const styles = {
  fixSize: {
    height: "600px",
    width: "350px",
    borderColot: "black",
  },
};
interface RegisterProps {
  history?: any;
}
const Register: React.FC<RegisterProps> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [registerNum, setRegisterNum] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [error, setError] = useState<any>(null);
  const [cautionMessage, setCautionMessage] = useState<string>("");

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
    if (e.target.name === "registerNum") {
      setRegisterNum(e.target.value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Check registration number
    firebase
      .firestore()
      .collection("users")
      .doc(registerNum)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              const user = firebase.auth().currentUser;
              user!
                .updateProfile({ displayName: username })
                .then(() => {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(registerNum)
                    .set({
                      uid: user?.uid,
                      username: username,
                      created: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                      console.log("Added " + username);
                    });
                })
                .catch((error) => {
                  setError({ error });
                });
              console.log("Register success");
              props.history.push("/");
            })
            .catch((error) => {
              console.log("Error in registering");
              console.log(error);
              setCautionMessage(error.message);
              setError({ error });
            });
        } else {
          setCautionMessage("Check your registration number again!");
        }
      });
  };
  return (
    <div className="auth--container" style={styles.fixSize}>
      <h2 style={{ marginBottom: "48px" }}>Register your account</h2>
      {error && <p className="error-message">{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <Input
          placeholder="input username"
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={handleChange}
        />
        <label htmlFor="email">Email address</label>
        <Input
          placeholder="input email"
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <Input.Password
          placeholder="input password"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChange}
        />
        <label htmlFor="registerNum">Registration Number</label>
        <Input
          placeholder="input provided registration number"
          type="string"
          name="registerNum"
          id="registerNum"
          value={registerNum}
          onChange={handleChange}
        />
        {cautionMessage !== "" && (
          <Alert
            message={cautionMessage}
            style={{ marginTop: "24px" }}
            type="error"
          />
        )}
        <button
          className="general-submit"
          style={{ margin: "24px 0" }}
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
