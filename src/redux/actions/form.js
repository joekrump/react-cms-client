export function update(value, fieldName, formName, errors) {
  return {
    type: "FORM_INPUT_CHANGE",
    value,
    fieldName,
    formName,
    errors
  };
}

export function inputError(errors, fieldName, formName){
  return {
    type: 'FORM_INPUT_ERROR',
    errors,
    fieldName,
    formName
  }
}

export function loadData(fieldValues, formName, valid){
  return {
    type: "FORM_LOAD",
    fieldValues,
    formName,
    valid
  };
}

export function reset(formName) {
  return {
    type: "FORM_RESET",
    formName
  };
}
export function valid(valid, formName) {
  return {
    type: "FORM_VALID",
    action,
    formName
  };
}