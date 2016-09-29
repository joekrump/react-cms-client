const initialState = {
  mode: 'browse' // possible modes: edit and browse
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MODE':
      return {
        mode: action.mode
      }
    default:
      return state;
  }
}

export {adminReducer as admin}