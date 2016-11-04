import assign from 'lodash.assign';
import merge from 'lodash.merge';
import initialState from '../store/initial_states/forms/forms';

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FORM_INPUT_CHANGE":
      return assign({}, state, {
        [action.formName]: {
          valid: (state[action.formName].valid /*&& (action.errors.length === 0)*/),
          resourcePath: state[action.formName].resourcePath,
          fields: assign({}, state[action.formName].fields, {
            [action.fieldName]: assign({}, state[action.formName].fields[action.fieldName], {
              value: action.value,
              errors: action.errors
            })
          })
        }
      });
    case "FORM_LOAD":
      var newState = state;

      Object.keys(state[action.formName].fields).forEach((fieldName) => {
        newState = merge({}, newState, {
          [action.formName]: {
            valid: action.valid,
            fields: assign({}, newState[action.formName].fields, {
              [fieldName]: assign({}, newState[action.formName].fields[fieldName], {
                value: action.fieldValues[fieldName],
                errors: []
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
              value: state[action.formName]['fields'][action.fieldName].value,
              errors: action.errors
            }
          })
        }
      });
    case 'FORM_VALID':
      return assign({}, state, {
        [action.formName]: merge({}, state[action.formName], {
          valid: action.valid
        })
      });
    default:
      return state;
  }
}

export {formReducer as forms}