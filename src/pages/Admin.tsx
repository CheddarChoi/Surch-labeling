import React from "react";

import firebase from "../firebase";
import "./Auth.css";
import { Button } from "antd";

import { labels } from "../variables/label-info";
// import videoInfo from "../assets/videoInfo.json";
import videoInfo from "../assets/videoInfo.json";
import musicvideoInfo from "../assets/musicvideoinfo.json";
import tutorialvideoInfo from "../assets/tutorialvideoinfo.json";

interface AdminProps {
  history?: any;
}

const addAllLabels = () => {
  const collection = firebase.firestore().collection("labels");
  labels.forEach((label) => {
    collection
      .add(
        Object.assign(
          {
            user: "global",
            created: firebase.firestore.FieldValue.serverTimestamp(),
          },
          label
        )
      )
      .then(() => {
        console.log("Added " + label.label);
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  });
};

const addAllVideos = (videoInfo: any[]) => {
  const collection = firebase.firestore().collection("videos");
  videoInfo.forEach((v) => {
    var assign = v.assign;
    if (typeof v.assign === "number") assign = v.assign.toString();
    collection
      .doc(v.id)
      .set({
        assign: assign || "test",
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

const removeAllvideos = (videoInfo: any[]) => {
  const collection = firebase.firestore().collection("videos");
  videoInfo.forEach((v) => {
    collection
      .doc(v.id)
      .delete()
      .then(() => {
        console.log("Deleted " + v.id);
      });
  });
};

const Admin: React.FC<AdminProps> = (props) => {
  return (
    <>
      <Button onClick={() => addAllVideos(videoInfo)}>
        Add Youtube videos to firebase
      </Button>
      <Button onClick={() => addAllVideos(musicvideoInfo)}>
        Add MUSIC videos to firebase
      </Button>
      <Button onClick={() => addAllVideos(tutorialvideoInfo)}>
        Add tutorial videos to firebase
      </Button>
      <Button onClick={() => removeAllvideos(musicvideoInfo)}>
        Remove all MUSIC videos from firebase
      </Button>
      <Button onClick={addAllLabels}>Add labels to firebase</Button>
      {/* {musicvideoInfo.map((v) => (
        <video
          src={v.src}
          style={{ width: "10px" }}
          onLoadedMetadata={(e) => handleLoadedMDN(e, v.id)}
        />
      ))} */}
    </>
  );
};

export default Admin;
