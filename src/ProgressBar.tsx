import classNames from "classnames";
import React, { useState, useEffect } from "react";
import styles from "./progressBar.module.css";
import { ReplyRounded } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import NoteIcon from "./NoteIcon";
import TimeProgressBar from "./TimeProgressBar";
import LiveNote from "./live-note";

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
  const classProps = classNames(styles.default, className);

  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );

  const firstStep = 120;
  const secondStep = 90;

  return (
    <div className={classProps}>
      <div className={styles.stepContainer}>
        {/* <div className={styles.step} style={{ width: firstStep }}>
          <span className={styles.tooltip} style={{ marginLeft: -firstStep/2 }}>
              First Step</span>
        </div>
        <div className={styles.step} style={{ width: secondStep }}>
          <span className={styles.tooltip} style={{ marginLeft: -secondStep/2 }}>
              Second Step</span>
        </div>
        <div className={styles.step} style={{ width: secondStep }}>
          <span className={styles.tooltip} style={{ marginLeft: -secondStep/2 }}>
              Second Step</span>
        </div> */}
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
