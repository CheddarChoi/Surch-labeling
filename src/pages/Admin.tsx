import React from "react";

import firebase from "../firebase";
import "./Auth.css";
import { Button } from "antd";

import { labels } from "../variables/label-info";
// import videoInfo from "../assets/videoInfo.json";
import videoInfo from "../assets/videoInfo.json";
import newVideoInfo from "../assets/newvideoinfo.json";
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

const downloadAllSegments = () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  console.log(csvContent);

  firebase
    .firestore()
    .collection("videos")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        let videoid = doc.id;
        console.log(videoid);
        doc.ref
          .collection("segments")
          .orderBy("startTime")
          .get()
          .then((snap2) => {
            snap2.forEach((doc) => {
              let data = doc.data();
              let rowArray = [
                videoid,
                data.startTime,
                data.endTime,
                data.label,
              ];
              let row = rowArray.join(",");
              csvContent += row + "\r\n";
            });
          });
      });
      setTimeout(() => {
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
      }, 10000);
    });
};

const downloadAllNotes = () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  console.log(csvContent);

  firebase
    .firestore()
    .collection("videos")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        let videoid = doc.id;
        console.log(videoid);
        doc.ref
          .collection("note")
          .orderBy("videoTimestamp")
          .get()
          .then((snap2) => {
            snap2.forEach((doc) => {
              let data = doc.data();
              let rowArray = [videoid, data.videoTimestamp, data.content];
              let row = rowArray.join(",");
              csvContent += row + "\r\n";
            });
          });
      });
      setTimeout(() => {
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
      }, 10000);
    });
};

const Admin: React.FC<AdminProps> = (props) => {
  return (
    <>
      <Button onClick={downloadAllSegments}>Download segment data</Button>
      <Button onClick={downloadAllNotes}>Download note data</Button>
      <br />
      <Button onClick={() => addAllVideos(newVideoInfo)}>
        Add Youtube videos to firebase
      </Button>
      <Button onClick={() => addAllVideos(musicvideoInfo)}>
        Add MUSIC videos to firebase
      </Button>
      <Button onClick={() => addAllVideos(tutorialvideoInfo)}>
        Add tutorial videos to firebase
      </Button>
      <br />
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
