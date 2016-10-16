import React from 'react';
import { PaymentForm } from './PaymentForm';
import { redA700 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import PaymentThankYou from './ThankYou';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PaymentForm.scss';
import Paper from 'material-ui/Paper';
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar'


class PaymentFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stripeLoading: true,
      stripeLoadingError: false
    }
  }
  render(){
    var content = null;

    if (this.state.stripeLoadingError) {
      content = (
        <div className="payment-content">
          <h3 style={{color: redA700}} className="payment-header">Error While Loading Payment System</h3>
          <p>
            Please try refreshing the page.
          </p>
        </div>
      );
    }
    else if (this.props.paymentComplete) {
      content = (
        <PaymentThankYou />
      );
    }
    else {
      content = (
        <PaymentForm submitDisabled={this.props.submitDisabled} editMode={this.props.editMode} />
      )
    }

    return(
      <Paper zDepth={2} className="form-container">
        {content}
        <NotificationSnackbar />
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    paymentComplete: state.forms.paymentForm.completed,
    isFormValid: !state.forms.loginForm.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackBar: (snackbarOpen) => {
      dispatch ({
        type: 'TOGGLE_SNACKBAR',
        snackbarOpen
      })
    }
  };
}

export default withStyles(s)(connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentFormContainer))