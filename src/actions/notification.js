export function snackbar_update(header, content, type) {
  return {
    type: "NOTIFICATION_SNACKBAR_UPDATE",
    header,
    content,
    type
  };
}