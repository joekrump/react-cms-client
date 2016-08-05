const initialState = {
  user: null,
  token: null,
  logged_in: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return {
        user: action.user,
        token: action.token,
        logged_in: true
      }
    case 'USER_LOGGED_OUT':
      return {
        user: null,
        token: null,
        logged_in: false
      }
    default:
      return state;
  }
}

export {userReducer as auth}