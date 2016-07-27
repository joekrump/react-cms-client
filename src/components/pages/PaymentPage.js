import React from 'react';

import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import PaymentContent from '../Payment/PaymentContent';

import {redA700, grey100} from 'material-ui/styles/colors';

const PaymentPage = React.createClass({
  getInitialState(){
    return {
      snackbarOpen: false,
      snackbarMessage: null,
      snackbarColor: redA700,
      snackbarHeaderText: 'Error'
    }
  },
  handleSnackbarClose(){
    this.setState({
      snackbarOpen: false,
    });
  },
  render() {
    return(<div>
      <h1>Payment Page</h1>
      <Paper zDepth={2} className="form-container">
        <PaymentContent />
        <Snackbar
          open={this.state.snackbarOpen}
          message={
            (<div style={{color: this.state.snackbarColor}}>
              <h2 style={{margin: '0'}}>{this.state.snackbarHeaderText}</h2>
              {this.state.snackbarMessage}
            </div>)}
          autoHideDuration={4000}
          bodyStyle={{backgroundColor: grey100, height: 'auto'}}
          style={{
            transform: this.state.snackbarOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 200px, 0)'
          }}
          onRequestClose={this.handleSnackbarClose}
        />
      </Paper>
    </div>);
  }
})


export default PaymentPage;