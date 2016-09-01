import React from 'react';
import { connect } from 'react-redux';
import { apiGet, apiPut, apiPost, updateToken } from '../../../http/requests'
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar'
import Editor from "../Admin/Page/Editor"

const listItemStyle = {
  padding: "0 16px"
};

const PageTemplate = React.createClass({

  getInitialState(){
    return {
      existingData: {},
      submitDisabled: false
    }
  },
  componentDidMount(){
    if(this.props.context === 'edit'){

      apiGet(this.props.resourceNamePlural + '/' + this.props.resourceId)
        .end(function(err, res){
          if(err !== null) {
            if(res.responseCode === 404) {
              console.warn(res);
            }
            // Something unexpected happened
          } else if (res.statusCode !== 200) {
            // not status OK
            console.log('Could not get Data for resource ', res);
          } else {
            // this.setState({existingData: res.body.data})
            updateToken(res.header.authorization);
            this.props.loadFormWithData(res.body.data, this.props.formName);
          }
        }.bind(this));
    } 
  },
  resetForm(){
    this.props.resetForm(this.props.formName)
  },

  handleFormSubmit(e) {
    e.preventDefault();
    this.submitToServer();
  },
  submitToServer(){
    var formInputValues = {};

    Object.keys(this.props.formFields).forEach((key) => {
      formInputValues[key] = this.props.formFields[key].value;
      return;
    })
    try {
      let serverRequest = this.props.context === 'edit' ? apiPut(this.props.submitUrl) : apiPost(this.props.submitUrl);

      serverRequest.send(formInputValues)
      .end(function(err, res){
        if(err !== null) {
          // console.log(err);
          // console.log(res);
          this.props.updateSnackbar(true, 'Error', res.body.message, 'error');
          // Something unexpected happened
        } else if (res.statusCode !== 200) {
          // not status OK
          // console.log('Resource Form not OK ',res);
          // res.body.errors gives an array of errors from the server.
          // 
          this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
        } else {

          this.props.updateFormCompleteStatus(
            true, 
            this.props.formName
          );
          
          if(this.props.context == 'edit') {
            this.props.updateSnackbar(true, 'Success', 'Update Successful', 'success');
          } else {
            this.props.updateSnackbar(true, 'Success', 'Added Successfully', 'success');
          }

          if(this.props.loginCallback) {
            this.props.loginCallback(res.body.user, res.body.token)
          } else {
            if(this.props.context !== 'edit'){
              setTimeout(this.resetForm, 500);
            }
          }
        }
      }.bind(this));
    } catch (e) {
      console.log('Exception: ', e)
    }
  },
  render() {
    return (
      <Editor />
    )
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    token: state.auth.token
  }
}

export default connect(
  mapStateToProps,
  null
)(PageTemplate)