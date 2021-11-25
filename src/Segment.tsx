import React, { useState, useEffect } from "react";

import { connect, useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setSelected } from "./redux/modules/selectedSegment";
import { key2color } from "./variables/label-info";

import { setSegmentListFromDB } from "./redux/modules/segmentList";

import "./segment.css";

interface IProps {
  // src: string;
}

const Segment: React.FC<IProps> = (props) => {
  const [currSegment, setCurrSegment] = useState<number>(-1);

  const segmentList = useSelector(
    (state: RootState) => state.setSegmentList.segmentList
  );
  const dispatch = useDispatch();

  const setSegment = (index: number) => {
    dispatch(setSelected(index));
  };

  const changeSegment = (index: number) => {
    setCurrSegment(index);
    setSegment(index);
  };

  useEffect(() => {
    setSegment(-1);
  }, []);

  useEffect(() => {
    dispatch(setSegmentListFromDB("testvideo1"));
  }, [segmentList]);

  return (
    <div className="segment-container">
      <div className="labels">
        {segmentList.map((segment: any) => {
          if (segment.index === currSegment)
            return (
              <div
                className="surch-segment selected"
                style={{
                  width: segment.endTime - segment.startTime,
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
                  width: segment.endTime - segment.startTime,
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
        })}
      </div>
    </div>
  );
};

export default Segment;
