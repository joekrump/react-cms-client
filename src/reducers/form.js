import assign from 'lodash.assign';

const initialState = { //define initial state - an empty form
  paymentForm: {
    submitDisabled: false,
    completed: false,
    errors: null,
    fields: {

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
      return assign({}, state, {
        [action.formName]: {
          fields: {
          }
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
        [action.formName]: {
          error: action.errorMessage,
          fields: state[action.formName].fields
        }
      });
    default:
      return state;
  }
}

export {formReducer as forms}