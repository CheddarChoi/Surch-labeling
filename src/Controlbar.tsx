import React, { useState, memo } from "react";
import classNames from "classnames";

import ProgressBar from "./ProgressBar";

import styles from "./controlbar.module.css";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import muteIcon from "./assets/mute.png";
import volumeIcon from "./assets/volume.png";
import { useSelector } from "react-redux";
import { RootState } from "./redux/modules";

interface IProps {
  onProgressChange: (percent: number) => void;
  onPlayIconClick: () => void;
  startTime: number;
  totalTime: number;

  showControl: boolean;
  nowPlaying: boolean;
  videoElement: HTMLVideoElement | null;
}

const Controlbar: React.FC<IProps> = ({
  onProgressChange,
  onPlayIconClick,
  totalTime,
  startTime,
  showControl,
  nowPlaying,
  videoElement,
}) => {
  const [volumeClicked, setVolumeClicked] = useState(true);

  const playControlClassProps = classNames(styles.playWrapper, {
    [styles.fadeIn]: showControl,
  });
  const controlBarClassProps = classNames(styles.controlBar, {
    [styles.fadeIn]: showControl,
  });
  const timeDisplays = classNames(styles.timeDisplays);
  const startTimeClassProps = classNames(styles.text, styles.startTime);
  const endTimeClassProps = classNames(styles.text, styles.endTime);
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );

  const handleVolume = () => {
    if (volumeClicked) {
      if (videoElement) {
        videoElement.muted = true;
      }
      setVolumeClicked(false);
    } else {
      if (videoElement) {
        videoElement.muted = false;
      }
      setVolumeClicked(true);
    }
  };

  const onMouseUp = () => {
    if (videoElement) {
      // controller를 옮긴 시점에 currentTime이 최신화 되지 않아, 이를 위해 수정
      // videoElement.currentTime = currentTime;
      nowPlaying ? videoElement.play() : videoElement.pause();
    }
    console.log("onMouseUp");
  };

  const onMouseDown = () => {
    if (videoElement) {
      videoElement.pause();
      console.log("onMouseDown");
    }
  };

  const toTimeString = (seconds: number) => {
    return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
  };

  return (
    <>
      <div className={controlBarClassProps}>
        <div style={{ flex: "1" }}>
          <ProgressBar
            max={totalTime}
            className={styles.progressBar}
            onChange={onProgressChange}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            videoElement={videoElement}
          />
          <div className={timeDisplays}>
            <span className={startTimeClassProps}>
              {videoTime != null ? toTimeString(videoTime) : toTimeString(0)}
            </span>
            <span className={endTimeClassProps}>{toTimeString(totalTime)}</span>
          </div>
        </div>
        <img
          className={styles.volume}
          src={volumeClicked ? volumeIcon : muteIcon}
          onClick={handleVolume}
          alt={""}
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      <div className={playControlClassProps}>
        {/* <div className={styles.playBg}> */}
        {nowPlaying ? (
          <PauseCircleFilledIcon
            className={styles.playIcon}
            onClick={onPlayIconClick}
          />
        ) : (
          <PlayCircleFilledIcon
            className={styles.playIcon}
            onClick={onPlayIconClick}
          />
        )}
        {/* <img
            className={styles.playIcon}
            src={nowPlaying ? pauseIcon : playIcon}
            onClick={onPlayIconClick}
            alt={""}
          /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default memo(Controlbar);
