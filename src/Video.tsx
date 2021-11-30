import React, { memo, useEffect, useRef, useState } from "react";
import NoteTaking from "./note-taking";
import Labels from "./Labels";
import Controlbar from "./Controlbar";
import { Button, Modal, Slider, Tooltip } from "antd";
import "./Video.css";
import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { setDTime } from "./redux/modules/videoDuration";
import firebase from "firebase";
import Segment from "./Segment";
import { setRange } from "./redux/modules/zoomRange";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { setvideoCollectionFromDB } from "./redux/modules/videoCollection";
import { Link } from "react-router-dom";

interface IProps {
  className?: string;
  videoid: string;
  src: string;
  user: any;
  registerNum: string;
}

const Video: React.FC<IProps> = ({
  className,
  src,
  videoid,
  user,
  registerNum,
}) => {
  const [nowPlaying, setNowPlaying] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const { videoElement, setVideoElement } = useVideoElement()!;
  const [editorIsFocused, seteditorIsFocused] = useState(false);
  const [onEdit, setonEdit] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  const ref = useRef<HTMLVideoElement>(null);

  type CountdownHandle = React.ElementRef<typeof NoteTaking>;
  const noteTakingRef = useRef<CountdownHandle>(null);

  setVideoElement(ref && ref.current);

  useEffect(() => {
    addTimeUpdate();
  }, []);
  useEffect(() => {
    setVideoSrc(src);
  }, [src]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const startTime = Math.floor(videoTime);
  const handleLoadedMDN = (e: any) => {
    setTotalTime(e.target.duration);
    dispatch(setDTime(e.target.duration));
    dispatch(setRange(0, e.target.duration));
  };
  // 동영상 시간 업데이트 함수
  const addTimeUpdate = () => {
    const observedVideoElement = ref && ref.current;
    if (observedVideoElement) {
      observedVideoElement.addEventListener("timeupdate", function () {
        setVideoTime(Math.floor(observedVideoElement.currentTime));
      });

      // 컴포넌트가 처음 마운트 될때 동영상 시작 안함
      setNowPlaying(false);
      // observedVideoElement.play();
    }
  };
  const setPlaybackRate = (rate: number) => {
    if (videoElement) {
      videoElement.playbackRate = rate;
    }
  };

  // progress 이동시켰을때 실행되는 함수
  const onProgressChange = (percent: number) => {
    if (!showControl) {
      setShowControl(true);
    }
    if (videoElement) {
      if (onEdit) {
        var confirm: boolean = window.confirm(
          "Do you want to discard the note and proceed?"
        );
        if (confirm) {
          const playingTime = videoElement.duration * (percent / 100);
          setVideoTime(playingTime);
          videoElement.currentTime = playingTime;
          noteTakingRef.current!.clearEditor();
        } else {
        }
      } else {
        const playingTime = videoElement.duration * (percent / 100);
        setVideoTime(playingTime);
        videoElement.currentTime = playingTime;
      }
    }
  };

  // play icon 클릭했을떄 실행되는 함수
  const onPlayIconClick = () => {
    if (videoElement) {
      if (nowPlaying) {
        setNowPlaying(false);
        videoElement.pause();
      } else {
        if (onEdit) {
          var confirm: boolean = window.confirm(
            "Do you want to discard the note and proceed?"
          );
          if (confirm) {
            setNowPlaying(true);
            videoElement.play();
            noteTakingRef.current!.clearEditor();
          } else {
          }
        } else {
          setNowPlaying(true);
          videoElement.play();
        }
      }
    }
  };

  // control bar visible 관련 함수
  // 재생중일때만 나가면 control바 안보이고 들어오면 컨드롤바 보이게
  const setControlVisible = () => {
    if (!showControl) {
      setShowControl(true);
    }
  };

  const setControlInvisible = () => {
    if (showControl && nowPlaying) {
      setShowControl(false);
    }
  };

  const marks = {
    0.5: { label: "x0.5" },
    1: { label: "x1" },
    1.5: { label: "x1.5" },
    2: { label: "x2" },
    3: { label: "x3" },
    4: { label: "x4" },
    5: { label: "x5" },
  };

  window.onkeydown = (event: KeyboardEvent): any => {
    if (event.key === " ") {
      if (!editorIsFocused) {
        if (nowPlaying) {
          setNowPlaying(false);
          videoElement.pause();
        } else {
          if (onEdit) {
            var confirm: boolean = window.confirm(
              "Do you want to discard the note and proceed?"
            );
            if (confirm) {
              setNowPlaying(true);
              videoElement.play();
              noteTakingRef.current!.clearEditor();
            } else {
            }
          } else {
            setNowPlaying(true);
            videoElement.play();
          }
        }
      }
    }
  };

  const segmentCompleted = (list: any) => {
    var complete = true;
    list.forEach((l: any) => {
      if (l.label === "undefined") complete = false;
    });
    return complete;
  };
  const setComplete = () => {
    const collection = firebase.firestore().collection("videos");
    collection
      .doc(videoid)
      .update({ complete: true })
      .then(() => {
        console.log("Complete video");
        dispatch(setvideoCollectionFromDB(registerNum));
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  return (
    <div className="wrapper">
      <div className="video-and-label-container">
        <div
          className="video-player-container"
          onMouseEnter={setControlVisible}
          onMouseLeave={setControlInvisible}
        >
          <video
            loop={false}
            muted={false}
            ref={ref}
            playsInline={true}
            onClick={onPlayIconClick}
            onLoadedMetadata={handleLoadedMDN}
            crossOrigin="Anonymous"
            style={{
              cursor: "pointer",
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <Controlbar
            onProgressChange={onProgressChange}
            onPlayIconClick={onPlayIconClick}
            totalTime={totalTime}
            startTime={startTime}
            showControl={showControl}
            nowPlaying={nowPlaying}
            videoElement={videoElement}
          />
        </div>
        <div className="label-or-note">
          <div className="note-and-slider-container">
            <div className="slider-container">
              <h4>Video Speed</h4>
              <Slider
                id="playbackslider"
                marks={marks}
                step={null}
                defaultValue={1}
                max={5}
                onChange={(value: any) => setPlaybackRate(value)}
              />
            </div>
          </div>
          <NoteTaking
            ref={noteTakingRef}
            videoid={videoid}
            userId={
              firebase.auth().currentUser
                ? firebase.auth().currentUser?.email!.split("@")[0]!
                : "TestUser"
            }
            nowPlaying={setNowPlaying}
            setIsFocused={seteditorIsFocused}
            setonEdit={setonEdit}
          />
          <Labels
            totalTime={totalTime}
            setIsFocused={seteditorIsFocused}
            videoid={videoid}
          />
        </div>
      </div>
      <Segment totalTime={totalTime} videoid={videoid} />
      <br />

      <div style={{ width: "100%" }}>
        <Tooltip title="Complete labeling for this video">
          <Button
            style={{ display: "flex", marginLeft: "auto", marginRight: "0" }}
            type="primary"
            onClick={setComplete}
          >
            Complete
            <ArrowForward />
          </Button>
        </Tooltip>
      </div>
      <Modal
        visible={isModalVisible}
        title="Complete!"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Keep labeling
          </Button>,
          <Button key="submit" type="primary">
            <Link to="/">Go to main page</Link>
          </Button>,
        ]}
      >
        <p>Thank you for labeling!</p>
      </Modal>
    </div>
  );
};

export default memo(Video);
