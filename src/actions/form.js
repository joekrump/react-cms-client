export function update(value, fieldName, formName) {
  return {
    type: "FORM_INPUT_CHANGE",
    value,
    fieldName,
    formName
  };
}

export function reset(formName) {
  return {
    type: "FORM_RESET",
    formName
  };
}