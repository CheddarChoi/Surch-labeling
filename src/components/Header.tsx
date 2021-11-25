import React from "react";
import { Layout, Menu, Button } from "antd";
import firebase from "../firebase";
import "./Header.css";
import { Link } from "react-router-dom";
const { Header } = Layout;

type HeaderProps = {
  login: boolean;
};

const signout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};

const MusicHeader: React.FC<HeaderProps> = ({ login }) => {
  return (
    <>
      {login && (
        <Header className="header-container">
          <div style={{ display: "flex" }}>
            <div className="logo">
              <Link to="/">Surch</Link>
            </div>
            <Menu
              style={{ display: "float" }}
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["label"]}
            >
              <Menu.Item key="label">Labelling</Menu.Item>
            </Menu>
          </div>
          <Button className="register-btn" onClick={signout}>
            Logout
          </Button>
        </Header>
      )}
      {!login && (
        <Header className="header-container">
          <div style={{ display: "flex" }}>
            <div className="logo">
              <Link to="/">Surch</Link>
            </div>
            <Menu
              style={{ display: "float" }}
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["label"]}
            >
              <Menu.Item key="label">Labelling</Menu.Item>
            </Menu>
          </div>
          <Link className="register-btn" to="/login">
            Login
          </Link>
        </Header>
      )}
    </>
  );
};

export default MusicHeader;
