const initialState = {
  data: [],
  loadingState: true
};
const reducer = (state = initialState, action) => {

  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        data:action.payload
      }
    case "SET_LOADING":
      return {
        ...state,
        loadingState:action.payload
      }
    default:
      return state
  }
}

export default reducer;