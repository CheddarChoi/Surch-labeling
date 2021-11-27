import React, { useState, useEffect, useRef } from "react";

import { Space } from "antd";
import "./note-collection.css";

import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { setCollectionFromDB } from "./redux/modules/noteCollection";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import StarBorderSharpIcon from "@material-ui/icons/StarBorderSharp";
import StarIcon from "@material-ui/icons/Star";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import WarningIcon from "@material-ui/icons/Warning";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import FlagIcon from "@material-ui/icons/Flag";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import HelpIcon from "@material-ui/icons/Help";
import Tooltip from "@material-ui/core/Tooltip";

const toTimeString = (seconds: number) => {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
};

interface noteCollectionProps {}
const tagsData = [
  "Challenging",
  "Skill",
  "Distinctive",
  "Opportunity",
  "Others",
];
const tagsCheckedIcon = [
  <FlagIcon style={{ color: "#f44336" }} />,
  <StarIcon style={{ color: "#4791db" }} />,
  <EmojiObjectsIcon style={{ color: "#ffc107" }} />,
  <WarningIcon style={{ color: "#59af28" }} />,
  <HelpIcon style={{ color: "#bdbdbd" }} />,
];
const tagsIcon = [
  <FlagOutlinedIcon />,
  <StarBorderSharpIcon />,
  <EmojiObjectsOutlinedIcon />,
  <ReportProblemOutlinedIcon />,
  <HelpOutlineIcon />,
];

const NoteCollection: React.FC<noteCollectionProps> = (props) => {
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );

  const [filter, setFilter] = useState<string[]>(tagsData);
  const [filteredCollection, setFilteredCollection] =
    useState<any[]>(collection);
  const refList = useRef<any[]>([]);
  const { videoElement } = useVideoElement()!;

  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const videoDTime = useSelector(
    (state: RootState) => state.setVideoDTime.videoDuration
  );
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  const [prevFocusedTime, setPrevFocusedTime] = useState<number>(0);

  useEffect(() => {
    dispatch(setCollectionFromDB("testvideo1", videoDTime));
  }, [dispatch, videoDTime]);

  useEffect(() => {
    setFilteredCollection(collection);
  }, [collection]);

  useEffect(() => {
    if (filteredCollection) {
      refList.current = refList.current.slice(0, filteredCollection.length);
      // console.log(refList, filteredCollection);
    }
  }, [collection, filteredCollection]);

  const linkToTime = (time: number) => {
    setVideoTime(time);
    setPrevFocusedTime(time);
    checkClosest(time);
    videoElement.currentTime = time;
  };
  const Notecomponent = ({ note }: any) => {
    const videoTime_num: number = note.videoTimestamp;
    const noteCategory: string = note.category;
    const noteCategoryList: string[] = noteCategory.split(" ");
    const noteCategoryClassName: string =
      noteCategoryList[noteCategoryList.length - 1].toLowerCase();
    const time_str: string = toTimeString(videoTime_num);

    return (
      <>
        <div className="notecategory">
          <div className={noteCategoryClassName}>{noteCategory}</div>
          <div onClick={() => linkToTime(videoTime_num)}>
            <a href="#">({time_str})</a>
          </div>
        </div>
        <div className="singlenote">
          <b className="noteheader">{note.userId}</b>
          {note.content}
          <br />
          {note.downloadURL && (
            <img className="noteimg" src={note.downloadURL} alt="" />
          )}
        </div>
      </>
    );
  };

  const checkClosest = (currentTime: number) => {
    var data: number[] = [];
    filteredCollection.map((note, i) => data.push(note.videoTimestamp));
    var target = currentTime; //21에 가장 가까운값 찾기
    // var near = 0;
    var abs = 0; //여기에 가까운 수'20'이 들어감
    var min = 10000000; //해당 범위에서 가장 큰 값
    var refIndex = 0;
    //[2] Process
    for (var i = 0; i < data.length; i++) {
      abs = data[i] - target < 0 ? -(data[i] - target) : data[i] - target;

      if (abs < min) {
        min = abs; //MIN
        refIndex = i;
      }
    }

    if (refList.current[refIndex]) {
      refList.current[refIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };
  if (videoTime - prevFocusedTime > 10) {
    console.log("FOCUS!!", videoTime, prevFocusedTime);
    checkClosest(videoTime);
    setPrevFocusedTime(videoTime);
  }

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...filter, tag]
      : filter.filter((t) => t !== tag);
    setFilter(nextSelectedTags);
    let _filteredCollection = collection.filter((item: any) => {
      if (
        nextSelectedTags.length > 0 &&
        nextSelectedTags.indexOf(item.category) > -1
      ) {
        return true;
      } else {
        return false;
      }
    });
    console.log("FILT ;", nextSelectedTags, _filteredCollection);
    return _filteredCollection;
  };

  return (
    <div>
      <div className="coll-category">
        <Space align="center" size="small">
          &nbsp;{"Show only"}
          <FormGroup row>
            {tagsData.map((tag) => (
              <Tooltip title={<h2 style={{ color: "white" }}>{tag}</h2>} arrow>
                <FormControlLabel
                  className="category-entry"
                  control={
                    <Checkbox
                      icon={tagsIcon[tagsData.indexOf(tag)]}
                      checkedIcon={tagsCheckedIcon[tagsData.indexOf(tag)]}
                      checked={filter.indexOf(tag) > -1}
                      onChange={(checked) => {
                        setFilteredCollection(
                          handleChange(tag, checked.target.checked)
                        );
                      }}
                      name={tag}
                    />
                  }
                  label=""
                />
              </Tooltip>
            ))}
          </FormGroup>
        </Space>
      </div>
      <div className="collection">
        {tagsData === filter
          ? collection.map((note: any, index: any) => (
              <div key={index} ref={(el) => (refList.current[index] = el)}>
                <Notecomponent note={note} key={index} />
              </div>
            ))
          : filteredCollection.map((note: any, index: any) => (
              <div key={index} ref={(el) => (refList.current[index] = el)}>
                <Notecomponent note={note} key={index} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default NoteCollection;
