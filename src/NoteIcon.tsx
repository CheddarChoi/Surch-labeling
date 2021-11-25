import React, { useState, useEffect } from "react";
import styles from "./progressBar.module.css";
import StarIcon from "@material-ui/icons/Star";
import WarningIcon from "@material-ui/icons/Warning";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import FlagIcon from "@material-ui/icons/Flag";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

import { useSelector } from "react-redux";
import { RootState } from "./redux/modules";

interface NoteIconProps {
  max: number;
  onChange: (progress: number) => void;
}

const NoteIcon: React.FC<NoteIconProps> = ({ max, onChange }) => {
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );

  // const [ref, setRef] = useState(
  //   db
  //     .collection("videos")
  //     .doc("testvideo1")
  //     .collection("note")
  //     .orderBy("videoTimestamp")
  // );
  // var unsubscribe = null;
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );

  useEffect(() => {
    // unsubscribe = ref.onSnapshot(onCollectionUpdate);
  }, []);

  // const onCollectionUpdate = (querySnapshot: any) => {
  //   const collection: any = [];
  //   querySnapshot.forEach((doc: any) => {
  //     collection.push(doc.data());
  //   });
  //   setCollection(collection);
  // };
  const percentNum = (videoTime / max || 0) * 100;
  const percent = `${percentNum}%`;
  const firstStep = 120;
  const secondStep = 90;

  const [showLiveNote, setshowLiveNote] = useState(true);

  const NoteBubble = ({ note }: any) => {
    const [size, setsize] = useState("20px");
    const videoTime_num: number = note.videoTimestamp;
    const [showNote, setshowNote] = useState(false);
    const notepos = (videoTime_num / max || 0) * 100;
    const fitpos = ((50 - notepos) / 50) * 9 + 6; // 9 = radius of controller
    const notepospercent = `${notepos}%`;
    const fitpospx = `${fitpos}px`;
    const notecategory = note.category;
    var bubblecolor = "#FFFFFF";
    switch (notecategory) {
      case "Challenging":
        bubblecolor = "#ff7875";
        break;
      case "Skill":
        bubblecolor = "#91d5ff";
        break;
      case "Distinctive":
        bubblecolor = "#fff566";
        break;
      case "Opportunity":
        bubblecolor = "#95de64";
        break;
      case "Others":
        bubblecolor = "#FFFFFF";
        break;
    }
    return (
      <div>
        <ChatBubbleIcon
          onMouseOver={() => {
            setshowNote(true);
            setshowLiveNote(false);
            setsize("25px");
          }}
          onMouseOut={() => {
            setshowNote(false);
            setshowLiveNote(true);
            setsize("20px");
          }}
          onClick={() => {
            onChange((note.videoTimestamp / max) * 100);
          }}
          className={styles.noteicon}
          style={{
            left: `calc(${notepospercent} + ${fitpospx})`,
            bottom: "10px",
            fontSize: size,
            color: bubblecolor,
            cursor: "pointer",
          }}
        />
        {showNote && <ShowNote note={note} />}
      </div>
    );
  };
  function Icon(category: any) {
    switch (category.category) {
      case "Challenging":
        return <FlagIcon style={{ color: "#f44336" }} />;
      case "Skill":
        return <StarIcon style={{ color: "#4791db" }} />;
      case "Distinctive":
        return <EmojiObjectsIcon style={{ color: "#ffc107" }} />;
      case "Opportunity":
        return <WarningIcon style={{ color: "#59af28" }} />;
      default:
        return <MoreHorizIcon style={{ fontSize: "20px", color: "#FFFFFF" }} />;
    }
  }

  const ShowNote = ({ note }: any) => {
    return (
      <div className={styles.notecontainer}>
        <div className={styles.categorybg}>
          <Icon category={note.category} />
          <div>{note.category}</div>
        </div>
        <div className={styles.livenotecontent}>
          <div>{note.content}</div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {collection.map((note: any, index: any) => (
        <div>
          <NoteBubble
            note={note}
            key={index}
            style={{ position: "relative" }}
          />
        </div>
      ))}
      {/* {showLiveNote && <LiveNote/>} */}
    </div>
  );
};

export default NoteIcon;
