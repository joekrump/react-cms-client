import { redA700 } from 'material-ui/styles/colors';

const initialState = { //define initial state - an empty form
  stripeToken: null, 
  snackbarOpen: false,
  snackbarColor: redA700,
  snackbarHeaderText: 'Error',
  snackbarMessage: null
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_STRIPE_TOKEN':
      return {
        stripeToken: action.stripeToken,
        snackbarOpen: state.snackbarOpen, 
        snackbarColor: state.snackbarColor, 
        snackbarHeaderText: state.snackbarHeaderText, 
        snackbarMessage: state.snackbarMessage 
      }
    case 'UPDATE_PAYMENT_NOTIFICATION':
      return {
        stripeToken: state.stripeToken,
        snackbarOpen: action.snackbarOpen, 
        snackbarColor: action.snackbarColor, 
        snackbarHeaderText: action.snackbarHeaderText, 
        snackbarMessage: action.snackbarMessage 
      }
    case 'TOGGLE_SNACKBAR':
      return {
        stripeToken: state.stripeToken,
        snackbarOpen: action.snackbarOpen, 
        snackbarColor: state.snackbarColor, 
        snackbarHeaderText: state.snackbarHeaderText, 
        snackbarMessage: state.snackbarMessage 
      }
    default:
      return state;
  }
}

export {paymentReducer as payments}