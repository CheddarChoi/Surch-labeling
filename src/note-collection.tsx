import React, { useEffect } from "react";
import firebase from "firebase";
import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { setCollectionFromDB } from "./redux/modules/noteCollection";
import { List, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import "./note-collection.css";

const toTimeString = (seconds: number) => {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
};

interface noteCollectionProps {
  videoid: string;
}

const NoteCollection: React.FC<noteCollectionProps> = (props) => {
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );

  const { videoElement } = useVideoElement()!;

  const videoDTime = useSelector(
    (state: RootState) => state.setVideoDTime.videoDuration
  );
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  useEffect(() => {
    dispatch(setCollectionFromDB(props.videoid, videoDTime));
  }, [dispatch, videoDTime]);

  const linkToTime = (time: number) => {
    setVideoTime(time);
    videoElement.currentTime = time;
  };

  const deleteNote = (note: any) => {
    console.log(note);
    const noteCollection = firebase
      .firestore()
      .collection("videos")
      .doc(props.videoid)
      .collection("note");

    noteCollection
      .doc(note.id)
      .delete()
      .then(() => {
        dispatch(setCollectionFromDB(props.videoid, videoDTime));
      });
    message.success("The note is deleted");
  };

  return (
    <div>
      <div className="collection">
        <List
          itemLayout="horizontal"
          dataSource={collection}
          renderItem={(note: any) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <div onClick={() => linkToTime(note.videoTimestamp)}>
                      <a>{toTimeString(note.videoTimestamp)}</a>
                    </div>
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteNote(note)}
                    ></Button>
                  </div>
                }
                description={note.content}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default NoteCollection;
