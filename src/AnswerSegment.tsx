import React, { useState, useEffect } from "react";
import firebase from "./firebase";

import { useSelector } from "react-redux";
import { RootState } from "./redux/modules";

import "./segment.css";
import toTimeString from "./totimeString";
import { textColorByBG } from "./variables/helperfuctions";

interface IProps {
  totalTime: number;
  videoid: string;
}

const AnswerSegment: React.FC<IProps> = (props) => {
  const labelList = useSelector(
    (state: RootState) => state.setLabelList.labelList
  );
  const [segmentList, setSegmentList] = useState<Object[]>([]);

  const zoomRangeStartTime = useSelector(
    (state: RootState) => state.setZoomRange.startTime
  );
  const zoomRangeEndTime = useSelector(
    (state: RootState) => state.setZoomRange.endTime
  );

  useEffect(() => {
    const collection: any = [];
    const ref = firebase
      .firestore()
      .collection("videos")
      .doc(props.videoid)
      .collection("segments")
      .orderBy("startTime");
    ref.get().then((snap) => {
      snap.forEach((doc) => {
        collection.push(Object.assign({}, { id: doc.id }, doc.data()));
      });
      setSegmentList(collection);
    });
  }, []);

  // ------- Helper Functions ------- //
  const time2width = (startTime: number, endTime: number) => {
    const fullWidth = zoomRangeEndTime - zoomRangeStartTime;
    var result;
    if (startTime >= zoomRangeStartTime && endTime <= zoomRangeEndTime)
      result = ((endTime - startTime) / fullWidth) * 100;
    else if (startTime <= zoomRangeStartTime && endTime <= zoomRangeEndTime)
      result = ((endTime - zoomRangeStartTime) / fullWidth) * 100;
    else if (startTime >= zoomRangeStartTime && endTime >= zoomRangeEndTime)
      result = ((zoomRangeEndTime - startTime) / fullWidth) * 100;
    else if (startTime <= zoomRangeStartTime && endTime >= zoomRangeEndTime)
      result = 100;
    else if (startTime > zoomRangeEndTime || endTime < zoomRangeStartTime)
      result = 0;
    return result;
  };

  const key2color = (key: string) => {
    var color = "#FFFFFF";
    labelList.forEach((label: any) => {
      if (label.label === key) color = label.color;
    });
    return color;
  };

  const timestamps = (startTime: number, endTime: number, step: number) => {
    var times = [];
    for (var i = 0; i <= step; i++) {
      times.push((startTime * (step - i) + endTime * i) / step);
    }
    return (
      <div className="timestamp-container">
        {times.map((t) => (
          <div className="timestamp">{toTimeString(t)}</div>
        ))}
      </div>
    );
  };

  return (
    <>
      {segmentList.map((segment: any) => {
        if (
          segment.startTime < zoomRangeEndTime &&
          segment.endTime > zoomRangeStartTime
        ) {
          return (
            <div
              id={"surch-segment-" + segment.id}
              className="surch-segment"
              style={{
                width: time2width(segment.startTime, segment.endTime) + "%",
                backgroundColor: key2color(segment.label),
                cursor: "default",
              }}
            >
              <div
                className="segment-name"
                style={{ color: textColorByBG(key2color(segment.label)) }}
              >
                {segment.label === null ? "Unlabeled" : segment.label}
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default AnswerSegment;
