import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setSelected } from "./redux/modules/selectedSegment";
import { key2color } from "./variables/label-info";

import { setSegmentListFromDB } from "./redux/modules/segmentList";

import "./segment.css";

interface IProps {
  // src: string;
}

const Segment: React.FC<IProps> = (props) => {
  const segmentList = useSelector(
    (state: RootState) => state.setSegmentList.segmentList
  );
  const zoomRangeStartTime = useSelector(
    (state: RootState) => state.setZoomRange.startTime
  );
  const zoomRangeEndTime = useSelector(
    (state: RootState) => state.setZoomRange.endTime
  );
  console.log(
    "[Segment.tsx] zoom range " + zoomRangeStartTime + " " + zoomRangeEndTime
  );

  const dispatch = useDispatch();
  const setSegment = (index: number) => {
    dispatch(setSelected(index));
  };

  const [currSegment, setCurrSegment] = useState<number>(-1);
  const changeSegment = (index: number) => {
    setSegment(index);
    setCurrSegment(index);
  };

  useEffect(() => {
    setSegment(-1);
    dispatch(setSegmentListFromDB("testvideo1"));
  }, []);

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
    console.log(startTime + " " + endTime + " " + result);
    return result;
  };

  return (
    <div className="segment-container">
      <div className="labels">
        {segmentList.map((segment: any) => {
          if (
            segment.startTime < zoomRangeEndTime &&
            segment.endTime > zoomRangeStartTime
          ) {
            if (segment.index === currSegment)
              return (
                <div
                  className="surch-segment selected"
                  style={{
                    width: time2width(segment.startTime, segment.endTime) + "%",
                    backgroundColor: key2color(segment.label),
                  }}
                  onClick={() => changeSegment(-1)}
                >
                  <div className="segment-name">
                    {segment.index} :{" "}
                    {segment.label === null ? "undefined" : segment.label}
                  </div>
                </div>
              );
            else
              return (
                <div
                  className="surch-segment"
                  style={{
                    width: time2width(segment.startTime, segment.endTime) + "%",
                    backgroundColor: key2color(segment.label),
                  }}
                  onClick={() => changeSegment(segment.index)}
                >
                  <div className="segment-name">
                    {segment.index} :{" "}
                    {segment.label === null ? "undefined" : segment.label}
                  </div>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default Segment;
