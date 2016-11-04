import initialState from '../store/initial_states/payment';

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_STRIPE_TOKEN':
      return {
        stripeToken: action.stripeToken,
      }
    default:
      return state;
  }
}

export {paymentReducer as payments}