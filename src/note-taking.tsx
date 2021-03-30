import React, { useState } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./note-taking.css";
import { Slider, Button, Radio, Popover } from "antd";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";
import CanvasDraw from "react-canvas-draw";
import { CompactPicker } from "react-color";
import { PictureOutlined } from "@ant-design/icons";
import { ColorLens, LineWeight, Undo, Delete, Save } from "@material-ui/icons";
import captureVideoFrame from "capture-video-frame";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { useVideoElement } from "./VideoElementContext";
import { setTime } from "./redux/modules/videoTime";
import { setCollection } from "./redux/modules/noteCollection";

var db = firebase.firestore();
var storage = firebase.storage();
interface noteTakingProps {
  userId: string;
  nowPlaying: any;
}

const NoteTaking: React.FC<noteTakingProps> = (props) => {
  const [editorState, seteditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [image, setImage] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [showCanvas, setshowCanvas] = useState<boolean>(false);
  const [showColorPicker, setColorPicker] = useState<boolean>(false);
  const [editorColor, seteditorColor] = useState<any>("#000000");
  const [showRadius, setshowRadius] = useState<boolean>(false);
  const [brushRadius, setbrushRadius] = useState<number>(3);
  const [noteCategory, setnoteCategory] = useState<string>("Awesome");
  const [placeholder, setplaceholder] = useState<string>(
    "This is such a useful tip because..."
  );
  const [prevVideoTime, setprevVideoTime] = useState<number>(-1);

  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const videoDTime = useSelector(
    (state: RootState) => state.setVideoDTime.videoDuration
  );
  const { videoElement, setVideoElement } = useVideoElement()!;
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  const handleChange = (e: EditorState) => {
    seteditorState(e);
  };
  const submitNote = () => {
    const noteCollection = db
      .collection("videos")
      .doc("testvideo1")
      .collection("note");
    //console.log(this.props.screenshot);

    const id: string = uuid();
    const ref: string = "screenshots/" + id + ".png";

    if (image != null) {
      storage
        .ref(ref)
        .putString(image, "data_url")
        .then((snapshot) =>
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("download:    ", downloadURL);
            noteCollection.add({
              category: noteCategory,
              content: editorState.getCurrentContent().getPlainText("\u0001"),
              //timestamp: "",
              userId: props.userId,
              videoTimestamp: videoTime,
              downloadURL: downloadURL,
            });
          })
        );
    } else {
      noteCollection.add({
        category: noteCategory,
        content: editorState.getCurrentContent().getPlainText("\u0001"),
        //timestamp: "",
        userId: props.userId,
        videoTimestamp: videoTime,
        downloadURL: "",
      });
    }
    seteditorState(
      EditorState.push(
        editorState,
        ContentState.createFromText(""),
        "remove-range"
      )
    );
    dispatch(setCollection("testvideo1", videoDTime));
    setprevVideoTime(-1);
    setshowCanvas(false);
    window.alert("saved!");
  };

  const changeplaceholder = (category: string) => {
    if (category === "Awesome") {
      setplaceholder("This is such a useful tip because...");
    } else if (category === "Difficult") {
      setplaceholder("Watch out doing this part because...");
    } else if (category === "What If") {
      setplaceholder("Instead of ..., How about ...?");
    } else if (category === "What & Why") {
      setplaceholder("Why in this part ...?");
    } else {
      setplaceholder("");
    }
  };

  const onChange = (e: any) => {
    // console.log(`radio checked:${e.target.value}`);
    setnoteCategory(e.target.value);
    changeplaceholder(e.target.value);
  };

  return (
    <div>
      <div>
        <Radio.Group
          className="category-group"
          onChange={onChange}
          defaultValue="Awesome"
        >
          <Radio.Button className="category-entry" value="Awesome">
            Awesome
          </Radio.Button>
          <Radio.Button className="category-entry" value="What If">
            What If
          </Radio.Button>
          <Radio.Button className="category-entry" value="What & Why">
            What & Why
          </Radio.Button>
          <Radio.Button className="category-entry" value="Difficult">
            Difficult
          </Radio.Button>
        </Radio.Group>
        <Button
          type="primary"
          shape="round"
          icon={<PictureOutlined />}
          onClick={() => {
            videoElement.pause();
            props.nowPlaying(false);
            var frame = captureVideoFrame(videoElement, "png", 1);
            console.log("captured frame", frame);
            setImage(frame.dataUri);
            setshowCanvas(true);
          }}
        >
          Take a Screenshot and Draw
        </Button>
        <div className="draft-root">
          <Editor
            editorState={editorState}
            placeholder={placeholder}
            onChange={(e) => handleChange(e)}
            onFocus={() => {
              videoElement.pause();
              props.nowPlaying(false);
              setprevVideoTime(videoTime);
              console.log(videoTime, prevVideoTime);

              // if (videoElement) {
              //   while (editorState.getCurrentContent().hasText() || showCanvas) {
              //     if (videoTime !== prevVideoTime) {
              //       var confirm: boolean = window.confirm(
              //         "Do you want to discard the note and proceed?"
              //       );
              //       if (confirm) {
              //         seteditorState(
              //           EditorState.push(
              //             editorState,
              //             ContentState.createFromText(""),
              //             "remove-range"
              //           )
              //         );
              //         setprevVideoTime(-1);
              //         setshowCanvas(false);
              //       } else {
              //         setVideoTime(prevVideoTime);
              //       }
              //     }
              //   }
              // }
            }}
          />
          <Button type="primary" onClick={submitNote}>
            Submit
          </Button>
        </div>
      </div>

      <div className="note-taking-container">
        {showCanvas && (
          <div className="screenshot-editor-container">
            <div className="screenshot-picture-container">
              <CanvasDraw
                ref={(canvas: any) => {
                  setCanvas(canvas);
                }}
                imgSrc={image}
                canvasWidth="30vw"
                canvasHeight="24vw"
                lazyRadius="0"
                brushColor={editorColor}
                brushRadius={brushRadius}
              />
            </div>

            <div>
              <Popover placement="bottom" content="Brush Color">
                <Button
                  onClick={() => {
                    setColorPicker(!showColorPicker);
                    setshowRadius(false);
                  }}
                >
                  <ColorLens />
                </Button>
              </Popover>
              <Popover placement="bottom" content="Brush Radius">
                <Button
                  onClick={() => {
                    setColorPicker(false);
                    setshowRadius(!showRadius);
                  }}
                >
                  <LineWeight />
                </Button>
              </Popover>
              <Popover placement="bottom" content="Undo">
                <Button
                  onClick={() => {
                    canvas.undo();
                  }}
                >
                  <Undo />
                </Button>
              </Popover>
              <Popover placement="bottom" content="Clear">
                <Button
                  onClick={() => {
                    canvas.clear();
                  }}
                >
                  <Delete />
                </Button>
              </Popover>
              <Popover placement="bottom" content="Save">
                <Button
                  onClick={() => {
                    let baseCanvas = canvas.canvasContainer.children[3];
                    let baseCanvasContex = baseCanvas.getContext("2d");
                    baseCanvasContex.drawImage(
                      canvas.canvasContainer.children[1],
                      0,
                      0
                    ); // add drawing
                    setImage(baseCanvas.toDataURL());
                  }}
                >
                  <Save />
                </Button>
              </Popover>
            </div>

            <div>
              {showColorPicker ? (
                <div>
                  <CompactPicker
                    color={editorColor}
                    onChange={(color) => {
                      seteditorColor(color.hex);
                    }}
                  />
                </div>
              ) : null}
              {showRadius ? (
                <div className="lineweight-container">
                  <Slider
                    min={1}
                    max={10}
                    onChange={(value: React.SetStateAction<number>) => {
                      setbrushRadius(value);
                    }}
                    value={typeof brushRadius === "number" ? brushRadius : 3}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteTaking;
