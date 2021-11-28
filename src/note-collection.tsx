import React, { useEffect } from "react";

import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { setCollectionFromDB } from "./redux/modules/noteCollection";
import { List } from "antd";

import "./note-collection.css";

const toTimeString = (seconds: number) => {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
};

interface noteCollectionProps {}

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
    dispatch(setCollectionFromDB("testvideo1", videoDTime));
  }, [dispatch, videoDTime]);

  const linkToTime = (time: number) => {
    setVideoTime(time);
    videoElement.currentTime = time;
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
                  <div onClick={() => linkToTime(note.videoTimestamp)}>
                    <a>{toTimeString(note.videoTimestamp)}</a>
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
