const initialState = {
  snackbar: {
    show: false,
    header: null, 
    content: null,
    notificationType: 'success' // types are 'success', 'error', 'warning' and 'info'
  }
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NOTIFICATION_SNACKBAR_UPDATE':
      return {
        snackbar: {
          show: action.show,
          header: action.header,
          content: action.content,
          notificationType: action.notificationType
        }
      }
    case 'NOTIFICATION_SNACKBAR_CLOSE':
      return {
        snackbar: {
          show: false,
          header: state.header,
          content: state.content,
          notificationType: state.notificationType
        }
      }
    default:
      return state;
  }
}

export {notificationReducer as notifications}