import assign from 'lodash.assign';

const initialState = { //define initial state - an empty form
  paymentForm: {
    values: {

    }
  },
  loginForm: {
    values: {

    }
  }
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FORM_INPUT_CHANGE":
      return assign({}, state, {
        [action.formName]: {
          values: assign({}, state[action.formName].values, {
            [action.fieldName]: action.value
          })
        }
      });

    case "FORM_RESET":
      return assign({}, state, {
        [action.formName]: {
          values: {
          }
        }
      });

    default:
      return state;
  }
}

export {formReducer as forms}