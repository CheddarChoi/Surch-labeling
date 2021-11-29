import { Dispatch } from "react";
import firebase from "../../firebase";

var db = firebase.firestore();

const SET_VIDEOCOLLECTION = "videoCollection/SET_VIDEOCOLLECTION" as const;

export const setCollection = (list: any[]) => ({
  type: SET_VIDEOCOLLECTION,
  payload: {
    list,
  },
});

export const setvideoCollectionFromDB =
  (uid: string) => (dispatch: Dispatch<setCollectionAction>) => {
    console.log("Get video list from DB");
    const collection: any = [];
    const ref = db.collection("videos");
    ref.get().then((snap) => {
      snap.forEach((doc) => {
        if (doc.data().assign === uid)
          collection.push(Object.assign({}, { id: doc.id }, doc.data()));
      });
      dispatch(setCollection(collection));
    });
  };

type setCollectionAction = ReturnType<typeof setCollection>;

type videoCollectionState = {
  videoCollection: any[];
};

const initialState: videoCollectionState = {
  videoCollection: [],
};

function setVideoCollection(
  state: videoCollectionState = initialState,
  action: setCollectionAction
): videoCollectionState {
  switch (action.type) {
    case SET_VIDEOCOLLECTION: {
      return { ...state, videoCollection: action.payload.list };
    }
    default: {
      return state;
    }
  }
}

export default setVideoCollection;
