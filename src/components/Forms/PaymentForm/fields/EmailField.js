import React from "react";
import { TextInput } from "../../../Form/index";

const EmailField = (props) => (
  <TextInput 
    placeholder="Email"
    label="Email"
    name="email"
    {...props}
  />
);

export default EmailField;
