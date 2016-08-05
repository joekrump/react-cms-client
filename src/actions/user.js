export function login_user(user, token) {
  return {
    type: 'USER_LOGGED_IN',
    user,
    token
  };
}

export function logout_user() {
  return {
    type: 'USER_LOGGED_OUT'
  }
}