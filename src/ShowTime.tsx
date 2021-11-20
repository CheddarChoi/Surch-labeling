import React from "react";
import styles from "./progressBar.module.css";

interface ShowTimeProps {
  timestamp: string;
  stampPos: string;
}

const ShowTime: React.FC<ShowTimeProps> = ({ timestamp, stampPos }) => {
  return (
    <div
      className={styles.timestamp}
      style={{ left: stampPos, color: "#FFFFFF" }}
    >
      {timestamp}
    </div>
  );
};

export default ShowTime;
