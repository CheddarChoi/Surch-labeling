import { Dispatch } from "react";
import firebase from "../../firebase";

var db = firebase.firestore();

const SET_COLLECTION = "noteCollection/SET_COLLECTION" as const;

export const setCollection = (collection: any[]) => ({
  type: SET_COLLECTION,
  payload: {
    collection,
  },
});

export const setCollectionFromDB =
  (videoName: string, videoDuration: number) =>
  (dispatch: Dispatch<setCollectionAction>) => {
    const collection: any = [];
    const category: any = [
      "Challenging",
      "Skill",
      "Distinctive",
      "Opportunity",
      "Others",
    ];
    console.log("Get Collection from DB");
    const ref = db
      .collection("videos")
      .doc(videoName)
      .collection("note")
      .orderBy("videoTimestamp");
    ref.get().then((snap) => {
      snap.forEach((doc) => {
        if (
          doc.data().videoTimestamp < videoDuration &&
          category.indexOf(doc.data().category) > -1 &&
          (doc.data().userId ===
            firebase.auth().currentUser?.email?.split("@")[0]! ||
            doc.data().userId === "dummy_example")
        )
          collection.push(doc.data());
      });
      dispatch(setCollection(collection));
    });
  };

type setCollectionAction = ReturnType<typeof setCollection>;

type noteCollectionState = {
  noteCollection: any[];
};

const initialState: noteCollectionState = {
  noteCollection: [],
};

// const onCollectionUpdate = (querySnapshot: any) => {
//   // return collection;
// };

function setNoteCollection(
  state: noteCollectionState = initialState,
  action: setCollectionAction
): noteCollectionState {
  switch (action.type) {
    case SET_COLLECTION: {
      // const collection: any = [];
      // const ref = db
      //   .collection("videos")
      //   .doc(action.payload.videoName)
      //   .collection("note")
      //   .orderBy("videoTimestamp");
      // ref.get().then((snap) => {
      //   snap.forEach((doc) => {
      //     //   console.log(
      //     //     "DATA!",
      //     //     doc.data().videoTimestamp,
      //     //     action.payload.videoDuration
      //     //   );
      //     if (doc.data().videoTimestamp < action.payload.videoDuration)
      //       collection.push(doc.data());
      //   });
      // });
      // setTimeout(() => {
      //   console.log()
      // }, 5000); //   console.log("Collection", collection);
      //   const collection = action.noteCollection;
      return { ...state, noteCollection: action.payload.collection };
    }
    default: {
      return state;
    }
  }
}

export default setNoteCollection;
