import React from "react";
import firebase from "./firebase";

// import { setLabel } from "./Segment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";

import "./labels.css";

import { labels } from "./variables/label-info";
import { setSegmentListFromDB } from "./redux/modules/segmentList";

interface IProps {
  // src: string;
}

const Labels: React.FC<IProps> = (props) => {
  const selectedSegment = useSelector(
    (state: RootState) => state.setSelectedSegment.selectedSegment
  );
  const segmentList = useSelector(
    (state: RootState) => state.setSegmentList.segmentList
  );
  const dispatch = useDispatch();

  const updateLabel = (index: number, label: any) => {
    console.log("[Label.tsx] Update " + index + " into " + label);
    if (index !== -1) {
      var docid = "";
      segmentList.forEach((segment: any) => {
        if (segment.index === index) docid = segment.id;
      });

      const collection = firebase
        .firestore()
        .collection("videos")
        .doc("testvideo1")
        .collection("segments");
      const document = collection.doc(docid);
      document
        .update({ label: label })
        .then(() => {
          dispatch(setSegmentListFromDB("testvideo1"));
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  const setLabelonSegment = (key: string) => {
    updateLabel(selectedSegment, key);
  };

  return (
    <div className="label-container">
      <h1 style={{ textAlign: "center" }}>
        Map labels for each video part/segment ,m
      </h1>
      <div className="labels">
        {labels.map((l) => (
          <div
            className="surch-label"
            style={{ backgroundColor: l.color }}
            onClick={() => setLabelonSegment(l.label)}
          >
            {l.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Labels;
