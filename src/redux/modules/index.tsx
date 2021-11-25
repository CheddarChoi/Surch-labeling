import { combineReducers } from "redux";
import setVideoTime from "./videoTime";
import setNoteCollection from "./noteCollection";
import setVideoDTime from "./videoDuration";
import setSelectedSegment from "./selectedSegment";
import setSegmentList from "./segmentList";

const rootReducer = combineReducers({
  setVideoTime,
  setNoteCollection,
  setVideoDTime,
  setSelectedSegment,
  setSegmentList,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
