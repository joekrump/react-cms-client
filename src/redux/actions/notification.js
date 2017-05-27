export function updateSnackbar(show, header, content, notificationType) {
  return {
    type: "UPDATE_SNACKBAR",
    show,
    header,
    content,
    notificationType
  };
}
