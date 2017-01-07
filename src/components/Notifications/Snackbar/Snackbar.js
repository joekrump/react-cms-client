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

    switch (this.props.notificationType) {
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
        break;
    }

    return (
      <Snackbar
        open={this.props.show}
        message={
          (<div style={{color: color}}>
            <h2 style={{margin: '0'}}>{this.props.header}</h2>
            {this.props.content}
          </div>)}
        autoHideDuration={3000}
        bodyStyle={{height: 'auto', border: `1px solid ${color}`, borderBottom: 'none'}}

        onRequestClose={this.handleSnackbarClose.bind(this)}
      />
    );
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    show: state.notifications.snackbar.show,
    header: state.notifications.snackbar.header,
    content: state.notifications.snackbar.content,
    notificationType: state.notifications.snackbar.notificationType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeSnackbar: () => {
      dispatch ({
        type: 'UPDATE_SNACKBAR',
        show: false,
        header: null,
        content: null,
        notificationType: ownProps.notificationType
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSnackbar)