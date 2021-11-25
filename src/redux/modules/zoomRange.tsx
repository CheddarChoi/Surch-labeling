const SET_ZOOMRANGE = "videoTime/SET_ZOOMRANGE" as const;

export const setRange = (startTime: number, endTime: number) => ({
  type: SET_ZOOMRANGE,
  startTime: startTime,
  endTime: endTime,
});

type setZoomAction = ReturnType<typeof setRange>;

type zoomRangeState = {
  startTime: number;
  endTime: number;
};

const initialState: zoomRangeState = {
  startTime: 0,
  endTime: 0,
};

function setZoomRange(
  state: zoomRangeState = initialState,
  action: setZoomAction
): zoomRangeState {
  switch (action.type) {
    case SET_ZOOMRANGE: {
      return { startTime: action.startTime, endTime: action.endTime };
    }
    default: {
      return state;
    }
  }
}

export default setZoomRange;
