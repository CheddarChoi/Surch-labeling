import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/modules";
import { setvideoCollectionFromDB } from "../redux/modules/videoCollection";
import { List, Button, Tooltip, Collapse, Checkbox, Select } from "antd";

import "./videoList.css";
import {
  CheckOutlined,
  ExclamationOutlined,
  StarFilled,
  HourglassOutlined,
  StarOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

interface AppProps {
  history?: any;
  user: any;
  registerNum: string;
  approved: boolean;
}

const VideoListAdmin: React.FC<AppProps> = ({
  history,
  user,
  registerNum,
  approved,
}) => {
  const videoCollection = useSelector(
    (state: RootState) => state.setVideoCollection.videoCollection
  );
  const dispatch = useDispatch();

  const [userList, setUserList] = useState<any[]>([]);
  const [checkedVideoList, setCheckedVideoList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    var list: any[] = [];
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          list.push(Object.assign({}, { id: doc.id }, doc.data()));
        });
        setUserList(list);
      });
  }, []);

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

  const countComplete = (collection: any[]) => {
    var res = 0;
    collection.forEach((c) => {
      if (c.complete) res++;
    });
    return res;
  };

  const allUsers = (collection: any[]) => {
    var users: any[] = [];
    collection.forEach((c) => {
      if (!users.includes(c.assign)) users.push(c.assign);
    });
    return users;
  };

  const onCheckboxChange = (checked: boolean, videoid: string) => {
    if (checked)
      setCheckedVideoList((checkedVideoList) => [...checkedVideoList, videoid]);
    else setCheckedVideoList(checkedVideoList.filter((v) => v !== videoid));
  };

  const onSelectChange = (value: any) => {
    setSelectedUser(value);
  };

  const createDuplicate = () => {
    // console.log("Assign video ");
    // console.log(checkedVideoList);
    // console.log("To");
    // console.log(selectedUser);

    if (selectedUser !== "") {
      const collection = firebase.firestore().collection("videos");
      checkedVideoList.forEach((videoid) => {
        collection
          .doc(videoid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const v: any = doc.data();
              collection
                .doc(videoid + "-2")
                .set({
                  assign: selectedUser,
                  author: v.author,
                  complete: false,
                  src: v.src,
                  title: v.title + " [reassigned]",
                })
                .then(() => {
                  console.log("Added " + videoid + "-2");
                });
            }
          });
      });
    }
  };

  const icon = (type: string, videoid: string) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          onChange={(e) => onCheckboxChange(e.target.checked, videoid)}
          style={{ marginRight: "10px" }}
        />
        {type === "tutorial" && (
          <Tooltip placement="right" title="Tutorial">
            <div
              className="icon-wrapper"
              style={{ backgroundColor: "rgb(241, 201, 19)" }}
            >
              <StarOutlined style={{ color: "white" }} />
            </div>
          </Tooltip>
        )}
        {type === "tutorialComplete" && (
          <Tooltip placement="right" title="Completed Tutorial">
            <div
              className="icon-wrapper"
              style={{ backgroundColor: "rgb(241, 201, 19)" }}
            >
              <StarFilled style={{ color: "white" }} />
            </div>
          </Tooltip>
        )}
        {type === "complete" && (
          <Tooltip placement="right" title="Complete">
            <div
              className="icon-wrapper"
              style={{ backgroundColor: "#1a90ff" }}
            >
              <CheckOutlined style={{ color: "white" }} />
            </div>
          </Tooltip>
        )}
        {type === "incomplete" && (
          <Tooltip placement="right" title="Incomplete">
            <div
              className="icon-wrapper"
              style={{ backgroundColor: "#777777" }}
            >
              <ExclamationOutlined style={{ color: "white" }} />
            </div>
          </Tooltip>
        )}
        {type === "wait" && (
          <Tooltip placement="right" title="Waiting">
            <div
              className="icon-wrapper"
              style={{ backgroundColor: "#777777" }}
            >
              <HourglassOutlined style={{ color: "white" }} />
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div className="list-container">
      <h1 style={{ fontWeight: "bold", marginTop: "50px", lineHeight: "20px" }}>
        This is admin page.
      </h1>

      <h3 style={{ marginBottom: "20px" }}>
        {countComplete(videoCollection)}/{videoCollection.length} videos
        completed
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ marginRight: "10px", marginBottom: "0" }}>
          Duplicate selected <b>{checkedVideoList.length} videos</b> and assign
          to{" "}
        </h3>
        <Select
          style={{ marginRight: "10px", width: 120 }}
          defaultValue="user"
          onChange={onSelectChange}
        >
          {userList.map((u) => (
            <Select.Option value={u.id}>{u.id}</Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={createDuplicate}>
          Create Duplicate
        </Button>
      </div>

      <Collapse>
        {allUsers(videoCollection).map((user, i) => {
          const videoList = videoCollection.filter(
            (v: any) => v.assign === user
          );
          const approved = userList.find((u) => u.id === user)?.approved;
          const status = countComplete(videoList) + "/" + videoList.length;
          return (
            <Collapse.Panel
              header={
                <div style={{ display: "flex", alignItems: "center" }}>
                  {user + " (" + status + ")"}
                  {approved && (
                    <Tooltip title="Approved User">
                      <CheckCircleFilled
                        style={{ color: "#1890ff", marginLeft: "5px" }}
                      />
                    </Tooltip>
                  )}
                </div>
              }
              key={i}
            >
              <List
                itemLayout="horizontal"
                dataSource={videoList}
                renderItem={(video: any) => {
                  if (video.id.includes("tutorial"))
                    return (
                      <List.Item>
                        <List.Item.Meta
                          style={{ alignItems: "center" }}
                          avatar={
                            video.complete
                              ? icon("tutorialComplete", video.id)
                              : icon("tutorial", video.id)
                          }
                          title={
                            <Link to={"/video/" + video.id}>{video.title}</Link>
                          }
                          description={video.author}
                        />
                      </List.Item>
                    );
                  else if (approved) {
                    return (
                      <List.Item>
                        <List.Item.Meta
                          style={{ alignItems: "center" }}
                          avatar={
                            video.complete
                              ? icon("complete", video.id)
                              : icon("incomplete", video.id)
                          }
                          title={
                            <Link to={"/video/" + video.id}>{video.title}</Link>
                          }
                          description={video.author}
                        />
                        {video.complete && (
                          <div>
                            <Button onClick={() => unmark(video)}>
                              Mark as imcomplete
                            </Button>
                          </div>
                        )}
                      </List.Item>
                    );
                  } else {
                    return (
                      <List.Item>
                        <List.Item.Meta
                          style={{ alignItems: "center" }}
                          avatar={icon("wait", video.id)}
                          title={
                            <Tooltip
                              placement="bottomLeft"
                              title="Please wait for tutorial approval"
                            >
                              <div
                                style={{
                                  width: video.title.length * 5 + "px",
                                  height: "12px",
                                  margin: "4px 0",
                                  borderRadius: "1px",
                                  backgroundColor: "lightgray",
                                }}
                              />
                            </Tooltip>
                          }
                          description={
                            <div
                              style={{
                                width: video.author.length * 5 + "px",
                                height: "8px",
                                marginTop: "12px",
                                marginBottom: "4px",
                                borderRadius: "1px",
                                backgroundColor: "lightgray",
                              }}
                            />
                          }
                        />
                      </List.Item>
                    );
                  }
                }}
              />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default VideoListAdmin;
