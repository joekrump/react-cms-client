import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { Form, TextInput, SubmitButton } from '../Form/index';
import { apiGet, apiPut, apiPost, updateToken } from '../../http/requests'
import NotificationSnackbar from '../notifications/Snackbar/Snackbar'

const listItemStyle = {
  padding: "0 16px"
};

const ResourceForm = React.createClass({

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
          
          if(this.props.ceontext == 'edit') {
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
    let field;
    let i = 0;

    let formFieldComponents = Object.keys(this.props.formFields).map((fieldName) => {
      field = this.props.formFields[fieldName];
      return (
        <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle} key={fieldName}>
          <TextInput 
            type={field.inputType} 
            placeholder={field.placeholder} 
            label={field.label} 
            formName={this.props.formName} 
            name={fieldName} 
            autoFocus={i++ === 0} 
            multiLine={field.inputType === 'textarea'}
          />
        </ListItem>
      );
    });

    return (
      <Form onSubmit={this.handleFormSubmit.bind(this)} className="form-content">
        <List>
          { formFieldComponents }
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={!this.state.submitDisabled} withIcon={true} label={this.props.context === 'edit' ? 'Update' : 'Create'}/>
          </ListItem>
        </List>
        <NotificationSnackbar 
          open={this.props.snackbar.show} 
          header={this.props.snackbar.header}
          content={this.props.snackbar.content}
          type={this.props.snackbar.notificationType}
        />
      </Form>
    )
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    isFormValid: !state.forms[ownProps.formName].error,
    formFields: state.forms[ownProps.formName].fields,
    token: state.auth.token,
    snackbar: {
      show: state.notifications.snackbar.show,
      header: state.notifications.snackbar.header,
      content: state.notifications.snackbar.content,
      notificationType: state.notifications.snackbar.notificationType
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_UPDATE',
        show,
        header,
        content,
        notificationType
      })
    },
    loadFormWithData: (fieldValues, formName) => {
      dispatch({
        type: 'FORM_LOAD',
        fieldValues,
        formName
      })
    },
    updateFormCompleteStatus: (complete, formName) => {
      dispatch ({
        type: 'FORM_COMPLETE',
        complete,
        formName
      })
    },
    resetForm: (formName) => {
      dispatch ({
        type: 'FORM_RESET',
        formName
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm)