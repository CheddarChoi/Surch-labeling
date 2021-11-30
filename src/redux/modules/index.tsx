import { combineReducers } from "redux";
import setVideoTime from "./videoTime";
import setNoteCollection from "./noteCollection";
import setVideoCollection from "./videoCollection";
import setVideoDTime from "./videoDuration";
import setSelectedSegment from "./selectedSegment";
import setSegmentList from "./segmentList";
import setLabelList from "./labelList";
import setZoomRange from "./zoomRange";
import storage from "redux-persist/es/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "reducer",
  storage,
  blacklist: ["setVideoDTime", "setVideoTime", "setZoomRange"],
};

const rootReducer = combineReducers({
  setVideoTime,
  setNoteCollection,
  setVideoCollection,
  setVideoDTime,
  setSelectedSegment,
  setSegmentList,
  setLabelList,
  setZoomRange,
});

export default persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
