export function updateStripeToken(stripeToken) {
  return {
    type: "UPDATE_STRIPE_TOKEN",
    stripeToken
  };
}

export function updateNotification(snackbarOpen, snackbarColor, snackbarHeaderText, snackbarMessage){
  return {
    type: 'UPDATE_PAYMENT_NOTIFICATION',
    snackbarOpen,
    snackbarColor,
    snackbarHeaderText,
    snackbarMessage
  }
}
