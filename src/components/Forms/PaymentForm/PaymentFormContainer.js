import React from 'react';
import PaymentForm from './PaymentForm';
import { connect } from 'react-redux';
import PaymentThankYou from './ThankYou';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PaymentForm.scss';
import Paper from 'material-ui/Paper';
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar';
import LoadingError from "./LoadingError";
import StripeContainer from "./StripeContainer";

class PaymentFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stripeLoading: true,
      stripeLoadingError: false
    };
  }

  render() {
    let content = null;
    if (this.state.stripeLoadingError) {
      content = (<LoadingError />);
    } else if (this.props.paymentComplete) {
      content = (<PaymentThankYou />);
    } else {
      content = (
        <StripeContainer>
          <PaymentForm
            submitDisabled={this.props.submitDisabled}
            editMode={this.props.editMode}
          />
        </StripeContainer>
      );
    }

    return (
      <Paper zDepth={2} className="form-container">
        {content}
        <NotificationSnackbar />
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  paymentComplete: state.forms.paymentForm.completed,
  isFormValid: !state.forms.loginForm.error,
  stripeToken: state.paymentReducer.stripeToken,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSnackBar: snackbarOpen => dispatch ({
    type: 'TOGGLE_SNACKBAR',
    snackbarOpen,
  }),
});

export default withStyles(s)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentFormContainer));
