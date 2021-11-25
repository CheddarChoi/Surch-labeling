import React, { useState, useImperativeHandle } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./note-taking.css";
import { Slider, Button, Radio, Popover, message, Space } from "antd";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";
import CanvasDraw from "react-canvas-draw";
import { CompactPicker } from "react-color";
import { PictureOutlined } from "@ant-design/icons";
import {
  ColorLens,
  LineWeight,
  Undo,
  Delete,
  Save,
  Clear,
  Refresh,
} from "@material-ui/icons";
import captureVideoFrame from "capture-video-frame";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { useVideoElement } from "./VideoElementContext";
import { setTime } from "./redux/modules/videoTime";
import { setCollectionFromDB } from "./redux/modules/noteCollection";
import StarBorderSharpIcon from "@material-ui/icons/StarBorderSharp";
import StarIcon from "@material-ui/icons/Star";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import WarningIcon from "@material-ui/icons/Warning";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import FlagIcon from "@material-ui/icons/Flag";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

var db = firebase.firestore();
var storage = firebase.storage();
interface noteTakingProps {
  userId: string;
  nowPlaying: any;
  setIsFocused: any;
  setonEdit: any;
}
const tagsCheckedIcon = [
  <FlagIcon style={{ color: "#f44336" }} />,
  <StarIcon style={{ color: "#4791db" }} />,
  <EmojiObjectsIcon style={{ color: "#ffc107" }} />,
  <WarningIcon style={{ color: "#59af28" }} />,
  <MoreHorizIcon style={{ color: "#bdbdbd" }} />,
];

const tagsData = [
  "Challenging",
  "Skill",
  "Distinctive",
  "Opportunity",
  "Others",
];

type CountdownHandle = {
  clearEditor: () => void;
};
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const NoteTaking = React.forwardRef(
  (props: noteTakingProps, ref: React.Ref<CountdownHandle>) => {
    const [editorState, seteditorState] = useState<EditorState>(
      EditorState.createEmpty()
    );
    const [image, setImage] = useState<any>(null);
    const [canvas, setCanvas] = useState<any>(null);
    const [showCanvas, setshowCanvas] = useState<boolean>(false);
    const [showColorPicker, setColorPicker] = useState<boolean>(false);
    const [editorColor, seteditorColor] = useState<any>("#FCDC00");
    const [showRadius, setshowRadius] = useState<boolean>(false);
    const [brushRadius, setbrushRadius] = useState<number>(3);
    const [noteCategory, setnoteCategory] = useState<string>("Challenging");
    const [placeholder, setplaceholder] = useState<string>(
      "This part is difficult because..."
    );

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
        if (!showCanvas) {
          props.setonEdit(false);
        } else {
          props.setonEdit(true);
        }
      }
    };

    const submitNote = () => {
      console.log("Submit Note to DB");
      const noteCollection = db
        .collection("videos")
        .doc("testvideo1")
        .collection("note");
      //console.log(this.props.screenshot);

      const id: string = uuid();
      const ref: string = "screenshots/" + id + ".png";
      props.setonEdit(false);
      if (image != null) {
        const baseCanvas = canvas.canvasContainer.children[3];
        const baseCanvasContex = baseCanvas.getContext("2d");
        baseCanvasContex.drawImage(canvas.canvasContainer.children[1], 0, 0); // add drawing
        // add drawing on screenshot
        storage
          .ref(ref)
          .putString(baseCanvas.toDataURL(), "data_url")
          .then((snapshot) =>
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              noteCollection.add({
                category: noteCategory,
                content: editorState.getCurrentContent().getPlainText("\u0001"),
                //timestamp: "",
                userId: props.userId,
                videoTimestamp: videoTime,
                downloadURL: downloadURL,
              });
            })
          )
          .then(() => {
            dispatch(setCollectionFromDB("testvideo1", videoDTime));
          });

        message.success(
          "The note is saved at " +
            toTimeString(videoTime) +
            " along with the screenshot."
        );
      } else {
        noteCollection
          .add({
            category: noteCategory,
            content: editorState.getCurrentContent().getPlainText("\u0001"),
            //timestamp: "",
            userId: props.userId,
            videoTimestamp: videoTime,
            downloadURL: "",
          })
          .then(() => {
            dispatch(setCollectionFromDB("testvideo1", videoDTime));
          });
        message.success("The note is saved at " + toTimeString(videoTime));
      }
      seteditorState(
        EditorState.push(
          editorState,
          ContentState.createFromText(""),
          "remove-range"
        )
      );
      // dispatch(setCollectionFromDB("testvideo1", videoDTime));

      setshowCanvas(false);
      setImage(null);
    };

    const changeplaceholder = (category: string) => {
      if (category === "Challenging") {
        setplaceholder("This part is difficult because...");
      } else if (category === "Skill") {
        setplaceholder("Doing ... is exceptional because...");
      } else if (category === "Distinctive") {
        setplaceholder("This is such a useful tip because...");
      } else if (category === "Opportunity") {
        setplaceholder("Instead of ..., how about...?");
      } else {
        setplaceholder("");
      }
    };

    const onChange = (e: any) => {
      // console.log(`radio checked:${e.target.value}`);
      setnoteCategory(e.target.value);
      changeplaceholder(e.target.value);
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
        setshowCanvas(false);
        props.setonEdit(false);
        setImage(null);
      },
    }));

    return (
      <div>
        <div>
          <div className="note-header">
            <Radio.Group
              className="category-group"
              onChange={onChange}
              defaultValue="Challenging"
            >
              <Radio.Button className="category-entry" value="Challenging">
                <div className="buttonIcon">
                  <FlagIcon style={{ color: "#f44336", margin: "auto" }} />
                  Challenging
                </div>
              </Radio.Button>
              <Radio.Button className="category-entry" value="Skill">
                <div className="buttonIcon">
                  <StarIcon style={{ color: "#4791db", margin: "auto" }} />
                  Skill
                </div>
              </Radio.Button>
              <Radio.Button className="category-entry" value="Distinctive">
                <div className="buttonIcon">
                  <EmojiObjectsIcon
                    style={{ color: "#ffc107", margin: "auto" }}
                  />
                  Distinctive
                </div>
              </Radio.Button>
              <Radio.Button className="category-entry" value="Opportunity">
                <div className="buttonIcon">
                  <WarningIcon style={{ color: "#59af28", margin: "auto" }} />
                  Opportunity
                </div>
              </Radio.Button>
              <Radio.Button className="category-entry" value="Others">
                <div className="buttonIcon">
                  <MoreHorizIcon style={{ color: "#bdbdbd", margin: "auto" }} />
                  <span>Others</span>
                </div>
              </Radio.Button>
            </Radio.Group>
            {/* <Button
              type="primary"
              shape="round"
              icon={<PictureOutlined />}
              onClick={() => {
                props.setonEdit(true);
                videoElement.pause();
                props.nowPlaying(false);
                var frame = captureVideoFrame(videoElement, "png", 1);
                setImage(frame.dataUri);
                setshowCanvas(true);
              }}
            >
              Capture and Draw
            </Button> */}
          </div>
          <div className="draft-root">
            <Editor
              editorState={editorState}
              placeholder={placeholder}
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

        {/* <div className="note-taking-container">
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
                    <Refresh />
                  </Button>
                </Popover>

                <Popover placement="bottom" content="Discard">
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      var confirm: boolean = window.confirm(
                        "Do you want to discard the screenshot?"
                      );
                      if (confirm) {
                        if (!editorState.getCurrentContent().hasText()) {
                          props.setonEdit(false);
                        }
                        setImage(null);
                        setshowCanvas(false);
                      } else {
                      }
                    }}
                  >
                    <Clear style={{ color: "#FFFFFF" }} />
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
        </div> */}
      </div>
    );
  }
);

export default NoteTaking;
