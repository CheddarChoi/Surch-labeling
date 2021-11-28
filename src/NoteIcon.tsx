import React, { useState } from "react";
import styles from "./progressBar.module.css";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

import { useSelector } from "react-redux";
import { RootState } from "./redux/modules";

interface NoteIconProps {
  max: number;
  onChange: (progress: number) => void;
}

const NoteIcon: React.FC<NoteIconProps> = ({ max, onChange }) => {
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );

  const NoteBubble = ({ note }: any) => {
    const [size, setsize] = useState("20px");
    const videoTime_num: number = note.videoTimestamp;
    const [showNote, setshowNote] = useState(false);
    const notepos = (videoTime_num / max || 0) * 100;
    const fitpos = ((50 - notepos) / 50) * 9 + 6; // 9 = radius of controller
    const notepospercent = `${notepos}%`;
    const fitpospx = `${fitpos}px`;
    var bubblecolor = "#ff7875";
    return (
      <div>
        <ChatBubbleIcon
          onMouseOver={() => {
            setshowNote(true);
            setsize("25px");
          }}
          onMouseOut={() => {
            setshowNote(false);
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

  const ShowNote = ({ note }: any) => {
    return (
      <div className={styles.notecontainer}>
        <div className={styles.categorybg}>
          <MoreHorizIcon style={{ fontSize: "20px", color: "#FFFFFF" }} />
          <div>Note</div>
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
    </div>
  );
};

export default NoteIcon;
