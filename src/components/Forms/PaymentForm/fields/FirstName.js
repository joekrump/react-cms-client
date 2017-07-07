import React from "react";
import { TextInput } from "../../../Form/index";

const FirstNameField = (props) => (
  <TextInput
    placeholder="First Name"
    label="First Name"
    name="fname"
    autoFocus={true}
    {...props}
  />
);

export default FirstNameField;
