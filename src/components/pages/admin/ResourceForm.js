import React from 'react';
import request from 'superagent';
import AppConfig from '../../../../app_config/app';
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import { Form, TextInput, SubmitButton } from '../../Form/index';

const listItemStyle = {
  padding: "0 16px"
};

class ResourceForm extends React.Component {

  constructor (props){
    super(props)

    this.state = {
      submitDisabled: false
    }

    this.resetForm = this.resetForm.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.submitToServer = this.submitToServer.bind(this)
  }
  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.submitToServer(this);
  }
  submitToServer(self){
    var formInputValues = {};

    Object.keys(self.props.formFields).forEach((key) => {
      formInputValues[key] = self.props.formFields[key].value;
      return;
    })
    try {
      request.post(AppConfig.apiBaseUrl + this.props.submitUrl)
        .set('Authorization', 'Bearer ' + this.props.token)
        .send(formInputValues)
        .end(function(err, res){
          if(err !== null) {
            console.log(err);
            console.log(res);
            // Something unexpected happened
          } else if (res.statusCode !== 200) {
            // not status OK
            console.log('Resource Form not OK ',res);
          } else {

            self.props.updateFormCompleteStatus(true, self.props.formName);
            setTimeout(self.resetForm, 3000);
          }
        });
    } catch (e) {
      console.log('Exception: ', e)
    }

  }
  render() {
    let field;
    let i = 0;

    let formFieldComponents = Object.keys(this.props.formFields).map((fieldName) => {
      field = this.props.formFields[fieldName];

      return (
        <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle} key={fieldName}>
          <TextInput type={field.inputType} placeholder={field.placeholder} label={field.label} formName={this.props.formName} name={fieldName} autoFocus={i++ === 0}/>
        </ListItem>
      );
    });
      
    return (
      <Form onSubmit={this.handleFormSubmit} className="payment-content">
        <List>
          { formFieldComponents }
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={!this.state.submitDisabled} withIcon={true} label="Submit"/>
          </ListItem>
        </List>
      </Form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isFormValid: !state.forms[ownProps.formName].error,
    formFields: state.forms[ownProps.formName].fields,
    token: state.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // updateFormError: (error, formName) => {
    //   dispatch ({
    //     type: 'FORM_ERROR',
    //     error,
    //     formName
    //   })
    // },
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