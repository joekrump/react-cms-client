export function login_user(user, token, redirectPath) {
  return {
    type: 'USER_LOGGED_IN',
    user,
    token,
    redirectPath
  };
}

export function logout_user(redirectPath) {
  return {
    type: 'USER_LOGGED_OUT',
    redirectPath
  }
}