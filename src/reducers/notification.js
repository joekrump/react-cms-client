const initialState = {
  header: null, 
  content: null,
  type: 'success' // types are 'success', 'error', 'warning' and 'info'
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_STRIPE_TOKEN':
      return {
        header: action.header,
        content: action.content,
        type: action.type
      }
    default:
      return state;
  }
}

export {notificationReducer as notifications}