import classNames from "classnames";
import React, { useState, useEffect } from "react";

import { Slider } from "antd";
import styles from "./progressBar.module.css";
import { ReplyRounded } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import NoteIcon from "./NoteIcon";
import TimeProgressBar from "./TimeProgressBar";
import toTimeString from "./totimeString";
import LiveNote from "./live-note";
import { setRange } from "./redux/modules/zoomRange";

interface IProps {
  max: number;
  className?: string;
  onChange: (progress: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  videoElement: HTMLVideoElement | null;
}

const ProgressBar: React.FC<IProps> = ({
  max,
  className,
  onChange,
  onMouseDown,
  onMouseUp,
  videoElement,
}) => {
  const dispatch = useDispatch();
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const videoDTime = useSelector(
    (state: RootState) => state.setVideoDTime.videoDuration
  );
  const zoomStartTime = useSelector(
    (state: RootState) => state.setZoomRange.startTime
  );
  const zoomEndTime = useSelector(
    (state: RootState) => state.setZoomRange.endTime
  );
  const classProps = classNames(styles.default, className);

  useEffect(() => {
    dispatch(setRange(zoomStartTime, zoomEndTime));
  }, [zoomStartTime, zoomEndTime]);

  const changeZoomRange = (value: any) => {
    dispatch(setRange(value[0], value[1]));
  };

  // let marks: { [name: number]: string } = {};
  // marks[videoTime] = "";

  return (
    <div className={classProps}>
      <div className={styles.zoomRange}></div>
      <Slider
        range
        min={0}
        max={videoDTime}
        value={[zoomStartTime, zoomEndTime]}
        onChange={changeZoomRange}
        tipFormatter={toTimeString}
        // tooltipVisible={false}
        // marks={marks}
      />
      <div className={styles.stepContainer}>
        <div>
          <NoteIcon max={max} onChange={onChange} />
        </div>
      </div>

      <div className={styles.bgBar}>
        <TimeProgressBar
          max={max}
          onChange={onChange}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
