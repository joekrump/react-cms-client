import React from 'react';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import PaymentContent from '../Partials/PaymentContent';
import { connect } from 'react-redux';
import { grey100 } from 'material-ui/styles/colors';
import FrontendLayout from '../../../Layout/FrontendLayout'

const DonationPage = (props) => (
  <FrontendLayout>
    <h1>Donation Page</h1>
    <Paper zDepth={2} className="form-container">
      <PaymentContent />
      <Snackbar
        open={props.snackbarOpen}
        message={
          (<div style={{color: props.snackbarColor}}>
            <h2 style={{margin: '0'}}>{props.snackbarHeaderText}</h2>
            {props.snackbarMessage}
          </div>)}
        autoHideDuration={4000}
        bodyStyle={{backgroundColor: grey100, height: 'auto'}}
        style={{
          transform: props.snackbarOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 200px, 0)'
        }}
        onRequestClose={() => props.toggleSnackBar(false)}
      />
    </Paper>
  </FrontendLayout>
);

const mapStateToProps = (state) => {
  return {
    isFormValid: !state.forms.loginForm.error,
    snackbarOpen: state.payments.snackbarOpen,
    snackbarColor: state.payments.snackbarColor,
    snackbarHeaderText: state.payments.snackbarHeaderText,
    snackbarMessage: state.payments.snackbarMessage
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DonationPage)