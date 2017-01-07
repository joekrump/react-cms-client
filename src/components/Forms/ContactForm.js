// src/componetns/Forms/ContactForm.js
// 
import React from 'react';
import APIClient from '../../http/requests'
import { connect } from 'react-redux';

// mui components
import {List, ListItem} from 'material-ui/List';
import { Form, TextInput, SubmitButton } from '../Form/index';
import validations from '../../form-validation/validations'
import NotificationSnackbar from '../Notifications/Snackbar/Snackbar'

const listItemStyle = {
  padding: "0 16px"
};

const formName = "contactForm";

class ContactForm extends React.Component {

  componentDidMount(){
    this.resetForm();
  }

  resetForm(){
    this.props.resetForm(formName)
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.submitToServer();
    return true;
  }
  
  submitResolve = (res) => {
    console.log(res);
    if (res.statusCode > 299) {
      this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
    } else {
      this.handleSuccess(res);
    }
  }

  submitReject = (res) => {
    this.props.updateSnackbar(true, 'Error', 'ERROR!', 'warning');
  }

  submitToServer(){
    const client = new APIClient(this.props.dispatch)
    var formInputValues = {};

    Object.keys(this.props.formFields).forEach((key) => {
      formInputValues[key] = this.props.formFields[key].value;
    })
    
    let httpMethod = 'post';

    client[httpMethod]('contact', false, {data: formInputValues})
     .then(this.submitResolve, this.submitReject)
     .catch(this.handleRequestException)
  }

  handleRequestException = (exception) => {
    // console.warn('Exception: ', exception)
    this.props.updateSnackbar(true, 'Error', exception, 'error');
  }

  handleSuccess(res) {
    if(res.body.message) {
      this.props.updateSnackbar(true, 'Success', res.body.message, 'success');
    } else {
      this.props.updateSnackbar(true, 'Success', `Thanks for getting in touch!`, 'success');
    }

    this.resetForm();
  }

  getFieldValidationRules(fieldName){
    let formValidationRules = validations[formName][fieldName].rules

    return formValidationRules;
  }
  
  render() {
    return (
      <Form onSubmit={(e) => this.handleFormSubmit(e)} className="payment-content">
        <List>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="Name" label="Your Name" formName={formName} 
              name="name"
              validationRules={this.getFieldValidationRules('name')}
              autoFocus={true}
              />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="Email" label="Your Email" formName={formName} 
              name="email"
              validationRules={this.getFieldValidationRules('email')}
            />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="Message" label='Message' formName={formName} 
              name="message"
              multiLine={true}
              validationRules={this.getFieldValidationRules('message')}
            />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={this.props.isFormValid} withIcon={true} label="Send"/>
          </ListItem>
        </List>
        <NotificationSnackbar />
      </Form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isFormValid: state.forms.contactForm.valid,
    isValid:  state.forms[formName].valid,
    formFields: state.forms[formName].fields,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'UPDATE_SNACKBAR',
        show,
        header,
        content,
        notificationType
      })
    },
    resetForm: () => {
      dispatch ({
        type: 'FORM_RESET',
        formName: formName
      })
    },
    inputError: (errors, fieldName, formName) => {
      dispatch({
        type: 'FORM_INPUT_ERROR',
        errors,
        fieldName,
        formName
      })
    },
    updateFormCompleteStatus: (valid) => {
      dispatch ({
        type: 'FORM_VALID',
        valid,
        formName: formName
      })
    },
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactForm)
