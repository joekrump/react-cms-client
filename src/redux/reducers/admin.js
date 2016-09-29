const initialState = {
  mode: 'PASSIVE', // possible modes: EDIT_INDEX, PASSIVE, EDIT_CONTENT
  index: {
    hasChanges: false
  }
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MODE':
      return {
        mode: action.mode
      }
    case 'UPDATE_INDEX_HAS_CHANGES':
      return {
        index: {
          hasChanges: action.hasChanges
        }
      }
    default:
      return state;
  }
}

export {adminReducer as admin}