import initialState from '../store/initial_states/auth';

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return {
        user: action.user,
        token: action.token,
        logged_in: action.loggedIn
      }
    case 'USER_LOGGED_OUT':
      return {
        user: null,
        token: null,
        logged_in: false
      }
    case 'TOKEN_UPDATED':
      return {
        user: state.user,
        token: action.token,
        logged_in: state.logged_in
      }
    default:
      return state;
  }
}

export { auth };
