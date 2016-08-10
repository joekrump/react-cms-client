import assign from 'lodash.assign';

const initialState = { //define initial state - an empty form
  paymentForm: {
    submitDisabled: false,
    completed: false,
    errors: null,
    fields: {
      fname: {value: '', errors: null, inputType: 'text'},
      lname: {value: '', errors: null, inputType: 'text'},
      email: {value: '', errors: null, inputType: 'email'},
      amt: {value: '', errors: null, inputType: 'text'}
    }
  },
  loginForm: {
    submitDisabled: false,
    completed: false,
    error: null,
    fields: {
      email: {value: '', errors: null, inputType: 'email'},
      password: {value: '', errors: null, inputType: 'password'}
    }
  },
  userForm: {
    resourcePath: 'users/',
    submitDisabled: false,
    completed: false,
    error: null,
    fields: {
      name: {
        value: '', 
        errors: null, 
        inputType: 'text',
        label: 'Name',
        placeholder: ''
      },
      email: {
        value: '', 
        errors: null, 
        inputType: 'email',
        label: 'Email',
        placeholder: ''
      },
      password: {
        value: '', 
        errors: null, 
        inputType: 'password',
        label: 'Password',
        placeholder: '*********'
      }
    }
  },
  bookForm: {
    resourcePath: 'books/',
    submitDisabled: false,
    completed: false,
    error: null,
    fields: {
      title: {
        value: '', 
        errors: null, 
        inputType: 'text',
        label: 'Title',
        placeholder: ''
      },
      author_name: {
        value: '', 
        errors: null, 
        inputType: 'text',
        label: 'Author Name',
        placeholder: ''
      },
      page_count: {
        value: '', 
        errors: null, 
        inputType: 'text',
        label: 'Page Count',
        placeholder: ''
      }
    }
  }
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