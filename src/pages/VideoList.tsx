import React, { useEffect } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/modules";
import { setvideoCollectionFromDB } from "../redux/modules/videoCollection";
import { List, Button, Tooltip } from "antd";

import "./videoList.css";
import {
  CheckOutlined,
  ExclamationOutlined,
  StarFilled,
} from "@ant-design/icons";

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

  const icon = (type: string) => {
    if (type === "tutorial")
      return (
        <Tooltip title="Tutorial">
          <div
            className="icon-wrapper"
            style={{ backgroundColor: "rgb(241, 201, 19)" }}
          >
            <StarFilled style={{ color: "white" }} />
          </div>
        </Tooltip>
      );
    else if (type === "complete")
      return (
        <Tooltip title="Complete">
          <div className="icon-wrapper" style={{ backgroundColor: "#1a90ff" }}>
            <CheckOutlined style={{ color: "white" }} />
          </div>
        </Tooltip>
      );
    else if (type === "incomplete")
      return (
        <Tooltip title="Incomplete">
          <div className="icon-wrapper" style={{ backgroundColor: "#777777" }}>
            <ExclamationOutlined style={{ color: "white" }} />
          </div>
        </Tooltip>
      );
  };

  return (
    <div className="list-container">
      <h1 className="welcome-message">Nice to meet you, {user.displayName}!</h1>
      <List
        itemLayout="horizontal"
        dataSource={videoCollection}
        renderItem={(video: any) => {
          if (video.id.includes("tutorial"))
            return (
              <List.Item>
                <List.Item.Meta
                  style={{ alignItems: "center" }}
                  avatar={icon("tutorial")}
                  title={<Link to={"/video/" + video.id}>{video.title}</Link>}
                  description={video.author}
                />
              </List.Item>
            );
          else if (video.complete)
            return (
              <List.Item>
                <List.Item.Meta
                  style={{ alignItems: "center" }}
                  avatar={icon("complete")}
                  title={<Link to={"/video/" + video.id}>{video.title}</Link>}
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
                  avatar={icon("incomplete")}
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
