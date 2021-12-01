import React, { useState } from "react";
import { Link } from "react-router-dom";

import firebase from "../firebase";
import "./Auth.css";
import { Button } from "antd";

import videoInfo from "../assets/videoInfo.json";

interface AdminProps {
  history?: any;
}

const addAllVideos = () => {
  const collection = firebase.firestore().collection("videos");
  videoInfo.forEach((v) => {
    collection
      .doc(v.id)
      .set({
        assign: v.assign || "test",
        author: v.author,
        complete: false,
        src: v.src,
        title: v.title,
      })
      .then(() => {
        console.log("Added " + v.id);
      });
  });
};

const Admin: React.FC<AdminProps> = (props) => {
  return <Button onClick={addAllVideos}>Add videos to firebase</Button>;
};

export default Admin;
