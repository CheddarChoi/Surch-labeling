import React from "react";
import { Layout, Menu, Button } from "antd";
import "./Header.css";
const { Header } = Layout;

type HeaderProps = {
  login: boolean;
};

const MusicHeader: React.FC<HeaderProps> = ({ login }) => {
  return (
    <>
      {login && (
        <Header className="header-container">
          <div style={{ display: "flex" }}>
            <div className="logo">Surch</div>
            <Menu
              style={{ display: "float" }}
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["label"]}
            >
              <Menu.Item key="label">Labelling</Menu.Item>
            </Menu>
          </div>
          {/* <Button type="primary">Logout</Button> */}
        </Header>
      )}
      {!login && (
        <Header className="header-container">
          <div style={{ display: "flex" }}>
            <div className="logo">Surch</div>
            <Menu
              style={{ display: "float" }}
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["label"]}
            >
              <Menu.Item key="label">Labelling</Menu.Item>
            </Menu>
          </div>
          {/* <Button type="primary">Login</Button> */}
        </Header>
      )}
    </>
  );
};

export default MusicHeader;
