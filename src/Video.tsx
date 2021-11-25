import classNames from "classnames";
import React, { memo, useEffect, useRef, useState } from "react";
import NoteTaking from "./note-taking";
import Labels from "./Labels";
import Controlbar from "./Controlbar";
import { Slider } from "antd";
import LiveNote from "./live-note";
import "./Video.css";
import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { setDTime } from "./redux/modules/videoDuration";
import firebase from "firebase";
import Segment from "./Segment";

interface IProps {
  className?: string;
  src: string;
}

const Video: React.FC<IProps> = ({ className, src }) => {
  const [nowPlaying, setNowPlaying] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const { videoElement, setVideoElement } = useVideoElement()!;
  const [editorIsFocused, seteditorIsFocused] = useState(false);
  const [onEdit, setonEdit] = useState(false);

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

  // const totalTime = (ref && ref.current && ref.current.duration) || 0; //총 길이
  setVideoElement(ref && ref.current);

  const videoSrc = src || "";
  const startTime = Math.floor(videoTime);
  const handleLoadedMDN = (e: any) => {
    setTotalTime(e.target.duration);
    console.log(e.target.duration);
    dispatch(setDTime(e.target.duration));
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
  useEffect(() => {
    addTimeUpdate();
  }, []);

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
    0.5: { style: { color: "white" }, label: "x0.5" },
    1: { style: { color: "white" }, label: "x1" },
    1.5: { style: { color: "white" }, label: "x1.5" },
    2: { style: { color: "white" }, label: "x2" },
    3: { style: { color: "white" }, label: "x3" },
    4: { style: { color: "white" }, label: "x4" },
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

  return (
    <>
      <div className="video-and-label-container">
        <div
          className="video-player-container"
          onMouseEnter={setControlVisible}
          onMouseLeave={setControlInvisible}
        >
          <video
            className="video-container"
            loop={false}
            muted={true}
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
          <NoteTaking
            ref={noteTakingRef}
            userId={
              firebase.auth().currentUser
                ? firebase.auth().currentUser?.email!.split("@")[0]!
                : "TestUser"
            }
            nowPlaying={setNowPlaying}
            setIsFocused={seteditorIsFocused}
            setonEdit={setonEdit}
          />
          <Labels />
        </div>
      </div>
      <div className="live-note-container">{/* <LiveNote /> */}</div>
      <Segment />
      <div className="note-and-slider-container">
        <div className="slider-container">
          Video Speed
          <Slider
            id="playbackslider"
            marks={marks}
            step={null}
            defaultValue={1}
            max={4}
            onChange={(value: any) => setPlaybackRate(value)}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Video);
