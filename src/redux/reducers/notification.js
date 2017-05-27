import initialState from '../store/initial_states/notification';

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SNACKBAR':
      return {
        snackbar: {
          show: action.show,
          header: action.header,
          content: action.content,
          notificationType: action.notificationType
        }
      }
    default:
      return state;
  }
}

export {notificationReducer as notifications};
