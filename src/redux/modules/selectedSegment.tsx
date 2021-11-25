const SET_SELECTED = "videoTime/SET_SELECTED" as const;

export const setSelected = (index: number) => ({
  type: SET_SELECTED,
  selectedSegment: index,
});

type setTimeAction = ReturnType<typeof setSelected>;

type selectedSegmentState = {
  selectedSegment: number;
};

const initialState: selectedSegmentState = {
  selectedSegment: -1,
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
