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

// export function formError(errorMessage, formName){
//   return {
//     type: 'FORM_ERROR',
//     errorMessage,
//     formName
//   }
// }

export function loadData(fieldValues, formName){
  return {
    type: "FORM_LOAD",
    fieldValues,
    formName
  };
}

export function reset(formName) {
  return {
    type: "FORM_RESET",
    formName
  };
}
export function complete(complete, formName) {
  return {
    type: "FORM_COMPLETE",
    complete,
    formName
  };
}