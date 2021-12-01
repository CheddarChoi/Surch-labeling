import { Dispatch } from "react";
import firebase from "../../firebase";

var db = firebase.firestore();

const SET_LABELLIST = "labelList/SET_LABELLIST" as const;

export const setList = (list: any[]) => ({
  type: SET_LABELLIST,
  payload: {
    list,
  },
});

export const setLabelListFromDB =
  (uid: string) => (dispatch: Dispatch<setListAction>) => {
    console.log("Get labels list from DB");

    db.collection("labels")
      .orderBy("created")
      .get()
      .then((querySnapshot) => {
        var list: Object[] = [];
        querySnapshot.forEach((doc: any) => {
          if (doc.data().user === "global" || doc.data().user === uid)
            list.push(Object.assign({}, { id: doc.id }, doc.data()));
        });
        dispatch(setList(list));
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
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
