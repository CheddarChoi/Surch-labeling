import React, { useState } from "react";
import styles from "./progressBar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "./redux/modules";
import ShowTime from "./ShowTime";

interface TimeProps {
  max: number;
  onChange: (progress: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const TimeProgressBar: React.FC<TimeProps> = ({
  max,
  onChange,
  onMouseDown,
  onMouseUp,
}) => {
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const [mouseIsOn, setmouseIsOn] = useState<boolean>(false);
  const [timestamp, settimestamp] = useState<string>("");
  const [stampPos, setstampPos] = useState<string>("0px");

  const percentNum = (videoTime / max || 0) * 100;
  const percent = `${percentNum}%`;

  const toTimeString = (seconds: number) => {
    return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
  };

  function ShowTimeStamp(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) {
    const clientWidth = (event.target as HTMLInputElement).clientWidth - 18;
    var percent: number = (event.nativeEvent.offsetX - 9) / clientWidth;
    if (percent < 0) {
      percent = 0;
    } else if (percent > 1) {
      percent = 1;
    }
    const timestamp: string = toTimeString(percent * max);

    setmouseIsOn(true);
    settimestamp(timestamp);
    setstampPos(event.nativeEvent.offsetX - 20 + "px");
  }
  return (
    <>
      <div className={styles.bar} style={{ width: percent }}>
        {mouseIsOn && <ShowTime timestamp={timestamp} stampPos={stampPos} />}
      </div>
      <input
        onChange={(e) => {
          onChange(parseFloat(e.target.value));
        }}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onMouseMove={(e) => {
          ShowTimeStamp(e);
        }}
        onMouseLeave={(e) => setmouseIsOn(false)}
        type="range"
        min="0"
        max="100"
        step="0.000000001"
        value={percentNum}
        className={styles.controller}
        style={{
          cursor: "pointer",
        }}
      />
    </>
  );
};

export default TimeProgressBar;
