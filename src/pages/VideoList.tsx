import React, { useEffect } from "react";
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
        renderItem={(video: any) => (
          <List.Item>
            <List.Item.Meta
              style={{ alignItems: "center" }}
              avatar={icon(video.complete)}
              title={<Link to={"/video/" + video.id}>{video.title}</Link>}
              description={video.author}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default VideoList;
