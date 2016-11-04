export function updateStripeToken(stripeToken) {
  return {
    type: "UPDATE_STRIPE_TOKEN",
    stripeToken
  };
}