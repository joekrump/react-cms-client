import React from 'react';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import PaymentContent from '../Payment/PaymentContent';
import { connect } from 'react-redux';
import { grey100 } from 'material-ui/styles/colors';

const DonationPage = React.createClass({
  handleSnackbarClose(){
    this.props.toggleSnackBar(false);
  },
  render() {
    return(<div>
      <h1>Donation Page</h1>
      <Paper zDepth={2} className="form-container">
        <PaymentContent />
        <Snackbar
          open={this.props.snackbarOpen}
          message={
            (<div style={{color: this.props.snackbarColor}}>
              <h2 style={{margin: '0'}}>{this.props.snackbarHeaderText}</h2>
              {this.props.snackbarMessage}
            </div>)}
          autoHideDuration={4000}
          bodyStyle={{backgroundColor: grey100, height: 'auto'}}
          style={{
            transform: this.props.snackbarOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 200px, 0)'
          }}
          onRequestClose={this.handleSnackbarClose}
        />
      </Paper>
    </div>);
  }
})

const maptStateToProps = (state) => {
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
  maptStateToProps,
  mapDispatchToProps
)(DonationPage)