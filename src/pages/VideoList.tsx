import React, { useEffect } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/modules";
import { setvideoCollectionFromDB } from "../redux/modules/videoCollection";
import { List, Button } from "antd";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import "./videoList.css";

interface AppProps {
  history?: any;
  user: any;
  registerNum: string;
}

const VideoList: React.FC<AppProps> = ({ history, user, registerNum }) => {
  const videoCollection = useSelector(
    (state: RootState) => state.setVideoCollection.videoCollection
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setvideoCollectionFromDB(registerNum));
  }, [registerNum]);

  const unmark = (video: any) => {
    const collection = firebase.firestore().collection("videos");
    collection
      .doc(video.id)
      .update({ complete: false })
      .then(() => {
        console.log("Incomplete video");
        dispatch(setvideoCollectionFromDB(registerNum));
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const icon = (done: boolean) => {
    if (done) return <CheckCircleIcon className="done-icon" />;
    else return <RemoveCircleIcon className="todo-icon" />;
  };

  return (
    <div className="list-container">
      <h1 className="welcome-message">Nice to meet you, {user.displayName}!</h1>
      <List
        itemLayout="horizontal"
        dataSource={videoCollection}
        renderItem={(video: any) => {
          if (video.complete)
            return (
              <List.Item>
                <List.Item.Meta
                  style={{ alignItems: "center" }}
                  avatar={icon(video.complete)}
                  title={video.title}
                  description={video.author}
                />
                <div>
                  <Button onClick={() => unmark(video)}>
                    Mark as imcomplete
                  </Button>
                </div>
              </List.Item>
            );
          else
            return (
              <List.Item>
                <List.Item.Meta
                  style={{ alignItems: "center" }}
                  avatar={icon(video.complete)}
                  title={<Link to={"/video/" + video.id}>{video.title}</Link>}
                  description={video.author}
                />
              </List.Item>
            );
        }}
      />
    </div>
  );
};

export default VideoList;
