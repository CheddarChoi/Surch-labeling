import { Dispatch } from "react";
import firebase from "../../firebase";

var db = firebase.firestore();

const SET_SEGMENTLIST = "segmentList/SET_SEGMENTLIST" as const;

export const setList = (list: any[]) => ({
  type: SET_SEGMENTLIST,
  payload: {
    list,
  },
});

export const setSegmentListFromDB =
  (videoName: string, videoDTime: number) =>
  (dispatch: Dispatch<setListAction>) => {
    console.log("Get segment list from DB");
    const collection: any = [];
    const ref = db
      .collection("videos")
      .doc(videoName)
      .collection("segments")
      .orderBy("startTime");
    ref.get().then((snap) => {
      // 아직 document가 생성되지 않은 경우
      if (snap.size === 0) {
        console.log("No documents!");
        console.log("Video duration: " + videoDTime);
        const newSegment = {
          startTime: 0,
          endTime: videoDTime,
          label: "undefined",
        };
        const segmentCollection = db
          .collection("videos")
          .doc(videoName)
          .collection("segments");
        segmentCollection.add(newSegment).then((docref) => {
          dispatch(setList([Object.assign({}, newSegment, { id: docref.id })]));
        });
      } else {
        snap.forEach((doc) => {
          collection.push(Object.assign({}, { id: doc.id }, doc.data()));
        });
        dispatch(setList(collection));
      }
    });
  };

type setListAction = ReturnType<typeof setList>;

type segmentListState = {
  segmentList: any[];
};

const initialState: segmentListState = {
  segmentList: [],
};

function setSegmentList(
  state: segmentListState = initialState,
  action: setListAction
): segmentListState {
  switch (action.type) {
    case SET_SEGMENTLIST: {
      return { ...state, segmentList: action.payload.list };
    }
    default: {
      return state;
    }
  }
}

export default setSegmentList;
