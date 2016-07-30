import assign from 'lodash.assign';

const initialState = { //define initial state - an empty form
  paymentForm: {
    submitDisabled: false,
    completed: false,
    errors: null,
    fields: {
      fname: {value: '', errors: null},
      lname: {value: '', errors: null},
      email: {value: '', errors: null},
      amt: {value: '', errors: null}
    }
  },
  loginForm: {
    submitDisabled: false,
    completed: false,
    error: null,
    fields: {

    }
  }
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FORM_INPUT_CHANGE":
      return assign({}, state, {
        [action.formName]: {
          fields: assign({}, state[action.formName].fields, {
            [action.fieldName]: {
              value: action.value,
              errors: state[action.formName].errors
            }
          })
        }
      });

    case "FORM_RESET":
      var resetValues = {};

      Object.keys(state[action.formName].fields).map((key) => {
        resetValues[key] = {value: '', errors: null}
        return 1;
      });

      return assign({}, state, {
        [action.formName]: {
          error: null,
          completed: false,
          submitDisabled: false,
          fields: resetValues
        }
      });
    case 'FORM_INPUT_ERROR':
      return assign({}, state, {
        [action.formName]: {
          fields: assign({}, state[action.formName].fields, {
            [action.fieldName]: {
              value: action[action.formName].value,
              errors: action.errors
            }
          })
        }
      });
    case 'FORM_ERROR':
      return assign({}, state, {
        [action.formName]: assign({}, state[action.formName], {
          error: action.error
        })
      });
    case 'FORM_COMPLETE':
      return assign({}, state, {
        [action.formName]: assign({}, state[action.formName], {
          completed: action.complete
        })
      });
    default:
      return state;
  }
}

export {formReducer as forms}