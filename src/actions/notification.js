export function snackbar_update(show, header, content, notificationType) {
  return {
    type: "NOTIFICATION_SNACKBAR_UPDATE",
    show,
    header,
    content,
    notificationType
  };
}

export function snackbar_close() {
  return {
    type: "NOTIFICATION_SNACKBAR_CLOSE"
  };
}