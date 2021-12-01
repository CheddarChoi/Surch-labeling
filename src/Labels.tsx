import React, { useState, useEffect } from "react";
import firebase from "./firebase";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";

import "./labels.css";

import { labels } from "./variables/label-info";
import { setSegmentListFromDB } from "./redux/modules/segmentList";
import { Alert, Input, Modal } from "antd";
import { setLabelListFromDB } from "./redux/modules/labelList";
import { textColorByBG } from "./variables/helperfuctions";

interface IProps {
  videoid: string;
  totalTime: number;
  setIsFocused: (state: boolean) => any;
}

const Labels: React.FC<IProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelKey, setNewLabelKey] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#FFFFFF");
  const [cautionMessage, setCautionMessage] = useState("");

  const selectedSegment = useSelector(
    (state: RootState) => state.setSelectedSegment.selectedSegment
  );
  const labelList = useSelector(
    (state: RootState) => state.setLabelList.labelList
  );
  const dispatch = useDispatch();

  useEffect(() => {
    var uid = firebase.auth().currentUser?.uid;
    if (uid) dispatch(setLabelListFromDB(uid));
  }, [props.totalTime]);

  const showModal = () => {
    setIsModalVisible(true);
    props.setIsFocused(true);
  };

  const handleOk = () => {
    var isValidKey = true;
    labelList.forEach((label: any) => {
      console.log(label.label + " " + newLabelKey);
      console.log(label.label === newLabelKey);
      if (label.label === newLabelKey) isValidKey = false;
    });
    if (isValidKey) {
      addCustomLabel(newLabelName, newLabelKey, newLabelColor);
      setIsModalVisible(false);
    } else {
      setCautionMessage(
        "The key " + newLabelKey + " is already used! Please use another key."
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCautionMessage("");
  };

  const updateLabel = (id: string, label: any) => {
    console.log("[Label.tsx] Update " + id + " into " + label);

    const collection = firebase
      .firestore()
      .collection("videos")
      .doc(props.videoid)
      .collection("segments");
    const document = collection.doc(id);
    document
      .update({ label: label })
      .then(() => {
        dispatch(setSegmentListFromDB(props.videoid, props.totalTime));
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const setLabelonSegment = (key: string) => {
    if (selectedSegment !== "") updateLabel(selectedSegment, key);
  };

  const addAllLabels = () => {
    const collection = firebase.firestore().collection("labels");
    labels.forEach((label) => {
      collection
        .add(
          Object.assign(
            {
              user: "global",
              created: firebase.firestore.FieldValue.serverTimestamp(),
            },
            label
          )
        )
        .then(() => {
          console.log("Added " + label.label);
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    });
  };

  const addCustomLabel = (name: string, label: string, color: string) => {
    var uid = firebase.auth().currentUser?.uid;
    if (uid) {
      const collection = firebase.firestore().collection("labels");
      collection
        .add({
          name,
          label,
          color,
          user: uid,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("Added " + label);
          if (uid) dispatch(setLabelListFromDB(uid));
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  return (
    <div className="label-container">
      <h2 style={{ textAlign: "center" }}>
        Map labels for each video part/segment
      </h2>
      <div className="labels">
        {labelList.map((l: any) => (
          <div
            className="surch-label"
            style={{ backgroundColor: l.color, color: textColorByBG(l.color) }}
            onClick={() => setLabelonSegment(l.label)}
          >
            {l.name}
          </div>
        ))}
        {/* <Button onClick={addAllLabels}>Add all labels</Button> */}
        <div
          className="surch-label"
          style={{ backgroundColor: "#1890ff", color: "white" }}
          onClick={showModal}
        >
          + Add New Label
        </div>
        <Modal
          title="Add New Label"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <label className="modalLabel" htmlFor="labelName">
            Label Name
          </label>
          <Input
            style={{ marginBottom: "10px" }}
            id="labelName"
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label Name (ex. Bladder + Release)"
          />
          <label className="modalLabel" htmlFor="labelKey">
            Acronym for Label Name
          </label>
          <Input
            style={{ marginBottom: "10px" }}
            id="labelKey"
            onChange={(e) => setNewLabelKey(e.target.value)}
            placeholder="Acronym for Label (ex. BR)"
          />
          <label className="modalLabel" htmlFor="labelcolor">
            Label Color
          </label>
          <input
            style={{ marginBottom: "10px" }}
            id="labelcolor"
            onChange={(e) => setNewLabelColor(e.target.value)}
            type="color"
          />
          {cautionMessage !== "" && (
            <Alert message={cautionMessage} type="error" />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Labels;
