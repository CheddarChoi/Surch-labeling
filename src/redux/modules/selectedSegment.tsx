const SET_SELECTED = "videoTime/SET_SELECTED" as const;

export const setSelected = (id: string) => ({
  type: SET_SELECTED,
  selectedSegment: id,
});

type setTimeAction = ReturnType<typeof setSelected>;

type selectedSegmentState = {
  selectedSegment: string;
};

const initialState: selectedSegmentState = {
  selectedSegment: "",
};

function setSelectedSegment(
  state: selectedSegmentState = initialState,
  action: setTimeAction
): selectedSegmentState {
  switch (action.type) {
    case SET_SELECTED: {
      return { selectedSegment: action.selectedSegment };
    }
    default: {
      return state;
    }
  }
}

export default setSelectedSegment;
