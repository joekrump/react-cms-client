import React from 'react'
import Snackbar from 'material-ui/Snackbar';
import { redA700, greenA700, blueA700, yellowA700 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';

const NotificationSnackbar = () => ({
  handleSnackbarClose() {
    this.props.closeSnackbar();
  },
  render() {
    let color = greenA700;

    switch (this.props.type) {
      case 'info':
        color = blueA700;
        break;
      case 'error':
        color = redA700;
        break;
      case 'warning':
        color = yellowA700;
        break;
      default:
    }

    return (
      <Snackbar
        open={this.props.open}
        message={
          (<div style={{color: color}}>
            <h2 style={{margin: '0'}}>{this.props.header}</h2>
            {this.props.content}
          </div>)}
        autoHideDuration={4000}
        bodyStyle={{height: 'auto', border: `1px solid ${color}`, borderBottom: 'none'}}
        style={{
          transform: this.props.open ? 'translate3d(0, 0, 0)' : 'translate3d(0, 200px, 0)'
        }}
        onRequestClose={this.handleSnackbarClose.bind(this)}
      />
    );
  }
})

const mapDispatchToProps = (dispatch) => {
  return {
    closeSnackbar: () => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_CLOSE'
      })
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NotificationSnackbar)