import classNames from "classnames";
import React, { useState, useEffect } from "react";
import styles from "./progressBar.module.css";
import { ReplyRounded } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import NoteIcon from "./NoteIcon";
import TimeProgressBar from "./TimeProgressBar";
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
  const classProps = classNames(styles.default, className);

  const [currStartTime, setCurrStartTime] = useState(0);
  const [currEndTime, setCurrEndTime] = useState(0);

  const dispatch = useDispatch();
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );

  const zoomStartTime = useSelector(
    (state: RootState) => state.setZoomRange.startTime
  );
  const zoomEndTime = useSelector(
    (state: RootState) => state.setZoomRange.endTime
  );

  useEffect(() => {
    setCurrStartTime(zoomStartTime);
    setCurrEndTime(zoomEndTime);
  }, []);

  const setCurrRange = () => {
    dispatch(setRange(currStartTime, currEndTime));
  };

  const changeStartTime = (e: any) => {
    setCurrStartTime(e.target.value);
    setCurrRange();
  };
  const changeEndTime = (e: any) => {
    setCurrEndTime(e.target.value);
    setCurrRange();
  };

  const firstStep = 120;
  const secondStep = 90;

  return (
    <div className={classProps}>
      <div className={styles.zoomRange}>
        <input
          type="number"
          id="startTime"
          name="startTime"
          value={zoomStartTime}
          onChange={(e) => changeStartTime(e)}
        />
        <input
          type="number"
          id="endTime"
          name="endTime"
          value={zoomEndTime}
          onChange={(e) => changeEndTime(e)}
        />
      </div>
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
