import assign from 'lodash.assign';
import { bookForm,
         loginForm,
         paymentForm,
         permissionForm,
         roleForm,
         signupForm,
         userForm } from '../store/initial_states/forms/index'


// define initial state of forms
//
const initialState = { 
  bookForm,
  loginForm,
  paymentForm,
  permissionForm,
  roleForm,
  signupForm,
  userForm
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FORM_INPUT_CHANGE":
      return assign({}, state, {
        [action.formName]: {
          fields: assign({}, state[action.formName].fields, {
            [action.fieldName]: assign({}, state[action.formName].fields[action.fieldName], {
              value: action.value,
            })
          })
        }
      });
    case "FORM_LOAD":
      var newState = state;

      Object.keys(state[action.formName].fields).forEach((fieldName) => {
        newState = assign({}, newState, {
          [action.formName]: {
            fields: assign({}, newState[action.formName].fields, {
              [fieldName]: assign({}, newState[action.formName].fields[fieldName], {
                value: action.fieldValues[fieldName]
              })
            })
          }
        });
      })

      return newState;
    case "FORM_RESET":
      return assign({}, state, {
        [action.formName]: initialState[action.formName]
      });
    case 'FORM_INPUT_ERROR':
      return assign({}, state, {
        [action.formName]: {
          valid: false,
          fields: assign({}, state[action.formName].fields, {
            [action.fieldName]: {
              value: action[action.formName].value,
              errors: action.errors
            }
          })
        }
      });
    // case 'FORM_ERROR':
    //   return assign({}, state, {
    //     [action.formName]: assign({}, state[action.formName], {
    //       error: action.error
    //     })
    //   });
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