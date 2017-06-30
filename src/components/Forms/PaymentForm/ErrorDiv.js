import React from "react";
import { redA700 } from 'material-ui/styles/colors';

const ErrorDiv = (props) => (
  <div className="payment-content">
    <h3 style={{color: redA700}} className="payment-header">{props.title}</h3>
    <p>{ props.message }</p>
  </div>
);

export default ErrorDiv;
