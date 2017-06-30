import React from "react";
import ErrorDiv from "./ErrorDiv";

const LoadingError = () => (
  <ErrorDiv 
    title="Error While Loading Payment System"
    message="Please try refreshing the page."
  />
);

export default LoadingError;
