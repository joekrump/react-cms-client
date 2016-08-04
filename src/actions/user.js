export function logged_in(user) {
  return {
    type: "USER_LOGGED_IN",
    user
  };
}