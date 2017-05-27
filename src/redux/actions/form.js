export function update(value, fieldName, formName, errors, isTyping, fieldIsValid) {
  return {
    type: 'FORM_INPUT_CHANGE',
    value,
    fieldName,
    formName,
    errors,
    isTyping,
    valid: fieldIsValid,
  };
}

export function inputError(errors, fieldName, formName) {
  return {
    type: 'FORM_INPUT_ERROR',
    errors,
    fieldName,
    formName,
  };
}

export function loadData(fieldValues, formName, valid) {
  return {
    type: 'FORM_LOAD',
    fieldValues,
    formName,
    valid,
  };
}

export function reset(formName) {
  return {
    type: 'FORM_RESET',
    formName,
  };
}
export function updateFormValidationStatus(valid, formName) {
  return {
    type: 'FORM_VALID',
    valid,
    formName,
  };
}
