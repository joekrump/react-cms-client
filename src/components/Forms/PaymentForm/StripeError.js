import React from "react";
import ErrorDiv from "./ErrorDiv";

const StripeError = () => (
  <ErrorDiv 
    title="Stripe config is invalid"
    message="You need a valid Stripe secret in config/stripe.js to use this page as intended."
  />
);

export default StripeError;
