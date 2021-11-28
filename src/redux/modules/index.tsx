import { combineReducers } from "redux";
import setVideoTime from "./videoTime";
import setNoteCollection from "./noteCollection";
import setVideoDTime from "./videoDuration";
import setSelectedSegment from "./selectedSegment";
import setSegmentList from "./segmentList";
import setLabelList from "./labelList";
import setZoomRange from "./zoomRange";

const rootReducer = combineReducers({
  setVideoTime,
  setNoteCollection,
  setVideoDTime,
  setSelectedSegment,
  setSegmentList,
  setLabelList,
  setZoomRange,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
