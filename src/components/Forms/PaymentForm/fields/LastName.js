import React from "react";
import { TextInput } from "../../../Form/index";

const LastNameField = (props) => (
  <TextInput
    placeholder="Last Name"
    label="Last Name"
    name="lname"
    {...props}
  />
);

export default LastNameField;
