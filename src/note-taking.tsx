import React, { useState, useImperativeHandle } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import { Button, message } from "antd";
import firebase from "./firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";

import { useVideoElement } from "./VideoElementContext";
import { setCollectionFromDB } from "./redux/modules/noteCollection";

import "draft-js/dist/Draft.css";
import "./note-taking.css";

var db = firebase.firestore();
interface noteTakingProps {
  videoid: string;
  userId: string;
  nowPlaying: any;
  setIsFocused: any;
  setonEdit: any;
}

type CountdownHandle = {
  clearEditor: () => void;
};

const NoteTaking = React.forwardRef(
  (props: noteTakingProps, ref: React.Ref<CountdownHandle>) => {
    const [editorState, seteditorState] = useState<EditorState>(
      EditorState.createEmpty()
    );

    const videoTime = useSelector(
      (state: RootState) => state.setVideoTime.videoTime
    );
    const videoDTime = useSelector(
      (state: RootState) => state.setVideoDTime.videoDuration
    );
    const { videoElement, setVideoElement } = useVideoElement()!;
    const dispatch = useDispatch();

    const toTimeString = (seconds: number) => {
      return new Date(seconds * 1000)
        .toUTCString()
        .match(/(\d\d:\d\d:\d\d)/)![0];
    };

    const handleChange = (e: EditorState) => {
      seteditorState(e);
      if (e.getCurrentContent().hasText()) {
        props.setonEdit(true);
      } else {
        props.setonEdit(false);
      }
    };

    const submitNote = () => {
      var uid = firebase.auth().currentUser?.uid;
      const noteCollection = db
        .collection("videos")
        .doc(props.videoid)
        .collection("note");

      props.setonEdit(false);
      noteCollection
        .add({
          content: editorState.getCurrentContent().getPlainText("\u0001"),
          created: firebase.firestore.FieldValue.serverTimestamp(),
          userId: uid,
          videoTimestamp: videoTime,
        })
        .then(() => {
          dispatch(setCollectionFromDB(props.videoid, videoDTime));
        });
      message.success("The note is saved at " + toTimeString(videoTime));
      seteditorState(
        EditorState.push(
          editorState,
          ContentState.createFromText(""),
          "remove-range"
        )
      );
    };

    useImperativeHandle(ref, () => ({
      clearEditor() {
        seteditorState(
          EditorState.push(
            editorState,
            ContentState.createFromText(""),
            "remove-range"
          )
        );
        props.setonEdit(false);
      },
    }));

    return (
      <div>
        <div>
          <div className="note-header"></div>
          <div className="draft-root">
            <Editor
              editorState={editorState}
              placeholder={"Add Notes at " + toTimeString(videoTime)}
              onChange={(e) => handleChange(e)}
              onFocus={() => {
                videoElement.pause();
                props.nowPlaying(false);
                props.setIsFocused(true);
              }}
              onBlur={() => {
                props.setIsFocused(false);
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                submitNote();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

export default NoteTaking;
