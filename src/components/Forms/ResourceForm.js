import React from 'react';
import request from 'superagent';
import AppConfig from '../../../app_config/app';
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import { Form, TextInput, SubmitButton } from '../Form/index';

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

      request.get(AppConfig.apiBaseUrl + this.props.resourceNamePlural + '/' + this.props.resourceId)
        .set('Authorization', 'Bearer ' + this.props.token)
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
    this.submitToServer(this);
  },
  submitToServer(self){
    var formInputValues = {};

    Object.keys(self.props.formFields).forEach((key) => {
      formInputValues[key] = self.props.formFields[key].value;
      return;
    })
    try {
      let serverRequest;

      if(this.props.context === 'edit') {
        serverRequest = request.put(AppConfig.apiBaseUrl + this.props.submitUrl);
      } else {
        serverRequest = request.post(AppConfig.apiBaseUrl + this.props.submitUrl)
      }
      
      if(this.props.token){
        serverRequest = serverRequest.set('Authorization', 'Bearer ' + this.props.token);
      }
      
      serverRequest.set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
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
          if(self.props.loginCallback) {
            self.props.loginCallback(res.body.user, res.body.token)
          } else {
            setTimeout(self.resetForm, 1000);
          }
        }
      });
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
      <Form onSubmit={this.handleFormSubmit} className="form-content">
        <List>
          { formFieldComponents }
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={!this.state.submitDisabled} withIcon={true} label={this.props.context === 'edit' ? 'Update' : 'Create'}/>
          </ListItem>
        </List>
      </Form>
    )
  }
})

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