import { Dispatch } from "react";
import firebase from "../../firebase";

var db = firebase.firestore();

const SET_LABELLIST = "segmentList/SET_LABELLIST" as const;

export const setList = (list: any[]) => ({
  type: SET_LABELLIST,
  payload: {
    list,
  },
});

export const setLabelListFromDB =
  (uid: string) => (dispatch: Dispatch<setListAction>) => {
    console.log("Get labels list from DB");
    const collection: any = [];
    const ref = db.collection("labels").orderBy("created");
    ref.get().then((snap) => {
      snap.forEach((doc) => {
        const docdata = doc.data();
        if (docdata.user === "global" || docdata.user === uid)
          collection.push(Object.assign({}, { id: doc.id }, docdata));
      });
      dispatch(setList(collection));
    });
  };

type setListAction = ReturnType<typeof setList>;

type labelListState = {
  labelList: any[];
};

const initialState: labelListState = {
  labelList: [],
};

function setLabelList(
  state: labelListState = initialState,
  action: setListAction
): labelListState {
  switch (action.type) {
    case SET_LABELLIST: {
      return { ...state, labelList: action.payload.list };
    }
    default: {
      return state;
    }
  }
}

export default setLabelList;
