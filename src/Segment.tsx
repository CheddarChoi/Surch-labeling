import React, { useState, useEffect } from "react";
import firebase from "./firebase";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setSelected } from "./redux/modules/selectedSegment";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { ScissorOutlined } from "@ant-design/icons";

import { setSegmentListFromDB } from "./redux/modules/segmentList";

import "./segment.css";
import toTimeString from "./totimeString";
import { Button, Tooltip } from "antd";

interface IProps {
  totalTime: number;
  videoid: string;
}

const Segment: React.FC<IProps> = (props) => {
  const labelList = useSelector(
    (state: RootState) => state.setLabelList.labelList
  );
  const segmentList = useSelector(
    (state: RootState) => state.setSegmentList.segmentList
  );
  const zoomRangeStartTime = useSelector(
    (state: RootState) => state.setZoomRange.startTime
  );
  const zoomRangeEndTime = useSelector(
    (state: RootState) => state.setZoomRange.endTime
  );
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const selectedSegment = useSelector(
    (state: RootState) => state.setSelectedSegment.selectedSegment
  );

  const dispatch = useDispatch();

  const [indicatorPosition, setIndicatorPosition] = useState<number>(0);
  const [divideLocked, setDivideLocked] = useState<boolean>(false);

  const changeSegment = (id: string) => {
    dispatch(setSelected(id));
  };

  // useEffect(() => {
  //   console.log("Adding key event listener");
  //   document.addEventListener("keydown", handleKeyEvent, false);
  // }, []);

  useEffect(() => {
    changeSegment("");
    if (props.totalTime !== 0)
      dispatch(setSegmentListFromDB(props.videoid, props.totalTime));
  }, [props.totalTime]);

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
  const time2position = (timestamp: number) =>
    ((timestamp - zoomRangeStartTime) * 100) /
    (zoomRangeEndTime - zoomRangeStartTime);
  const position2time = (position: number) =>
    position * (zoomRangeEndTime - zoomRangeStartTime) - zoomRangeStartTime;
  const key2color = (key: string) => {
    var color = "#FFFFFF";
    labelList.forEach((label: any) => {
      if (label.label === key) color = label.color;
    });
    return color;
  };

  const displayHoverIndicator = (e: any) => {
    var rect = e.target.parentNode.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x <= rect.width)
      x >= 0 ? setIndicatorPosition(Math.round(x)) : setIndicatorPosition(0);
  };
  const divideSegment = (e: any) => {
    if (!divideLocked) {
      setDivideLocked(true);
      var rect = e.target.parentNode.getBoundingClientRect();
      const timestamp = position2time(indicatorPosition / rect.width);

      const collection = firebase
        .firestore()
        .collection("videos")
        .doc(props.videoid)
        .collection("segments");

      segmentList.forEach((segment: any) => {
        if (segment.startTime < timestamp && segment.endTime > timestamp) {
          collection
            .add({
              startTime: timestamp,
              endTime: segment.endTime,
              label: segment.label,
            })
            .then(() => {
              collection
                .doc(segment.id)
                .update({ endTime: timestamp })
                .then(() => {
                  console.log("Updated");
                  dispatch(
                    setSegmentListFromDB(props.videoid, props.totalTime)
                  );
                  setDivideLocked(false);
                })
                .catch((error) => {
                  console.error("Error updating document: ", error);
                });
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        }
      });
    }
  };

  const deleteSegment = (id: string, prev: boolean) => {
    const delIndex = segmentList.findIndex((s: any) => s.id === id);
    const delSegment = segmentList.at(delIndex);

    const collection = firebase
      .firestore()
      .collection("videos")
      .doc(props.videoid)
      .collection("segments");

    if (!prev && delIndex !== segmentList.length - 1) {
      const updateSegment = segmentList.at(delIndex + 1);
      collection
        .doc(updateSegment.id)
        .update({ startTime: delSegment.startTime, label: delSegment.label })
        .then(() => {
          collection
            .doc(delSegment.id)
            .delete()
            .then(() => {
              console.log("Deleted");
              dispatch(setSegmentListFromDB(props.videoid, props.totalTime));
              dispatch(setSelected(""));
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else if (prev && delIndex !== 0) {
      const updateSegment = segmentList.at(delIndex - 1);
      collection
        .doc(updateSegment.id)
        .update({ endTime: delSegment.endTime, label: delSegment.label })
        .then(() => {
          console.log("Updated");
          collection
            .doc(delSegment.id)
            .delete()
            .then(() => {
              console.log("Deleted");
              dispatch(setSegmentListFromDB(props.videoid, props.totalTime));
              dispatch(setSelected(""));
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  const deleteAllSegment = () => {
    const collection = firebase
      .firestore()
      .collection("videos")
      .doc(props.videoid)
      .collection("segments");

    collection
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((snapshot) => {
          snapshot.ref
            .delete()
            .then(
              dispatch(setSegmentListFromDB(props.videoid, props.totalTime))
            );
        });
      })
      .then(dispatch(setSegmentListFromDB(props.videoid, props.totalTime)));
  };

  const handleKeyEvent = (e: any) => {
    console.log("keyEvent:" + e.keyCode + " selected: " + selectedSegment);
    var keycode = e.keyCode;
    if (keycode === 8 && selectedSegment !== "")
      deleteSegment(selectedSegment, true);
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
    <div className="segment-container">
      <div style={{ position: "relative" }}>
        {timestamps(zoomRangeStartTime, zoomRangeEndTime, 4)}
        <div className="segments">
          {segmentList.map((segment: any) => {
            if (
              segment.startTime < zoomRangeEndTime &&
              segment.endTime > zoomRangeStartTime
            ) {
              if (segment.id === selectedSegment)
                return (
                  <div
                    id={"surch-segment-" + segment.id}
                    className="surch-segment selected"
                    style={{
                      width:
                        time2width(segment.startTime, segment.endTime) + "%",
                      backgroundColor: key2color(segment.label),
                    }}
                    onClick={() => changeSegment("")}
                  >
                    <div className="segment-name">
                      {segment.label === null ? "undefined" : segment.label}
                    </div>
                  </div>
                );
              else
                return (
                  <div
                    id={"surch-segment-" + segment.id}
                    className="surch-segment"
                    style={{
                      width:
                        time2width(segment.startTime, segment.endTime) + "%",
                      backgroundColor: key2color(segment.label),
                    }}
                    onClick={() => changeSegment(segment.id)}
                  >
                    <div className="segment-name">
                      {segment.label === null ? "undefined" : segment.label}
                    </div>
                  </div>
                );
            }
          })}
          <div
            className="icon-bar-container"
            style={{ left: time2position(videoTime) + "%" }}
          >
            <PlayCircleFilledIcon />
            <div className="curr-timestamp"></div>
          </div>
          <div
            className="hover-container"
            onMouseOut={(e) => setIndicatorPosition(0)}
            onMouseMove={(e) => displayHoverIndicator(e)}
            onClick={(e) => divideSegment(e)}
          >
            <div className="hoverIndicator" style={{ left: indicatorPosition }}>
              <div className="curr-hover"></div>
              <div
                style={{
                  marginBottom: "3px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "24px",
                  backgroundColor: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScissorOutlined style={{ fontSize: "16px", color: "white" }} />
              </div>
            </div>
          </div>
          <div style={{ width: "100%", marginTop: "12px", display: "flex" }}>
            {selectedSegment !== "" && (
              <>
                <Button onClick={() => deleteSegment(selectedSegment, true)}>
                  Merge with previous segment
                </Button>
                <Button onClick={() => deleteSegment(selectedSegment, false)}>
                  Merge with next segment
                </Button>
              </>
            )}
            <Tooltip title="All segment length and labels will be initialized">
              <Button
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "0",
                }}
                onClick={deleteAllSegment}
              >
                Reset all segments
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Segment;
