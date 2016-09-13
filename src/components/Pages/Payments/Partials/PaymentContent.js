import React from 'react';
import { PaymentForm } from './PaymentForm';
import { redA700 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import PaymentThankYou from './ThankYou';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PaymentContent.scss';

class PaymentContent extends React.Component {
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
        <PaymentForm />
      )
    }

    return(
      content
    );
  }
}

const maptStateToProps = (state) => {
  return {
    paymentComplete: state.forms.paymentForm.completed,
  }
}

const PaymentContentRedux = connect(
  maptStateToProps
)(PaymentContent)

export default withStyles(s)(PaymentContentRedux);