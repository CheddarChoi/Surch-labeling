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
  (videoName: string) => (dispatch: Dispatch<setListAction>) => {
    console.log("Reload segment list from DB");
    const collection: any = [];
    const ref = db
      .collection("videos")
      .doc(videoName)
      .collection("segments")
      .orderBy("index");
    ref.get().then((snap) => {
      snap.forEach((doc) => {
        collection.push(Object.assign({}, { id: doc.id }, doc.data()));
      });
      dispatch(setList(collection));
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
