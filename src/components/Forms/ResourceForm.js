import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { Form, TextInput, SubmitButton } from '../Form/index';
import APIClient from '../../http/requests'
import NotificationSnackbar from '../Notifications/Snackbar/Snackbar'
import validations from '../../form-validation/validations'
import { getResourceData } from '../../helpers/ResourceHelper';

const listItemStyle = {
  padding: "0 16px"
};

class ResourceForm extends React.Component {

  componentWillMount(){
    this.initForm();
  }

  initForm() {
    if(this.props.editContext === 'edit'){
      if(!this.props.formLoaded) {
        this.fetchDataFromServer();
      }
    } else {
      this.resetForm();
    }
  }

  fetchDataResolve = (res) => {
    if (res.statusCode < 300) {
      this.props.loadFormWithData(res.body.data, this.props.formName, true);
    }
  }

  fetchDataFromServer() {
    getResourceData(this.props.dispatch, this.props.resourceURL, this.fetchDataResolve, this.handleRequestException);
  }

  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.submitToServer();
  }
  
  submitResolve = (res) => {
    if (res.statusCode > 299) {
      this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
    } else {
      this.handleSuccess(res);
    }
  }

  submitReject = (res) => {
    console.log(res);
    if(res.body) {
      this.props.updateSnackbar(true, `Error ${res.body.status_code}`, res.body.message, 'warning');
    } else {
      this.props.updateSnackbar(true, res.statusCode, 'Unknown Error. Please report this as a bug', 'error');
    }
  }

  submitToServer(){
    const client = new APIClient(this.props.dispatch)
    var formInputValues = {};

    Object.keys(this.props.formFields).forEach((key) => {
      formInputValues[key] = this.props.formFields[key].value;
    })
    
    let httpMethod = this.props.editContext === 'edit' ? 'put' : 'post';

    client[httpMethod](this.props.resourceURL, true, {data: formInputValues})
     .then(this.submitResolve, this.submitReject)
     .catch(this.handleRequestException)
  }

  handleRequestException = (exception) => {
    this.props.updateSnackbar(true, 'Unexpected Error', 'Please report this as a bug', 'error');
  }

  handleSuccess(res) {
    if(res.body.message) {
      this.props.updateSnackbar(true, 'Success', res.body.message, 'success');
    } else {
      let verb = this.props.editContext === 'edit' ? 'Updated' : 'Added';
      this.props.updateSnackbar(true, 'Success', `${this.props.resourceNameSingular} ${verb} Successfully`, 'success');
    }

    if(this.props.successCallback) {
      this.props.successCallback(res.body.user, res.body.token)
    } else {
      if(this.props.editContext !== 'edit'){
        this.resetForm();
      }
    }
  }

  getFieldValidationRules(fieldName){
    return validations[this.props.formName][fieldName].rules[this.props.editContext] !== undefined ? 
                validations[this.props.formName][fieldName].rules[this.props.editContext] :
                validations[this.props.formName][fieldName].rules
  }

  makeSubmitButtonText() {
    if(this.props.buttonText) {
      return this.props.buttonText;
    } else {
      return this.props.editContext === 'edit' ? 'Update' : 'Create'
    }
  }

  render() {
    let field;
    let i = 0;

    let formFieldComponents = Object.keys(this.props.formFields).map((fieldName) => {
      field = this.props.formFields[fieldName];
      if(field.inputType === 'hidden') {
        return (
          <input 
            type="hidden" 
            name={fieldName} 
            value={this.props.formFields[fieldName].value} 
            key={fieldName} 
          />
        );
      } else {
        return (
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle} key={fieldName}>
            <TextInput 
              type={field.inputType} 
              placeholder={field.placeholder} 
              label={field.label} 
              formName={this.props.formName} 
              name={fieldName}
              validationRules={this.getFieldValidationRules(fieldName)} 
              autoFocus={i++ === 0} 
              multiLine={field.inputType === 'textarea'}
            />
          </ListItem>
        );
      }
    });

    return (
      <Form onSubmit={(event) => this.handleFormSubmit(event)} className="form-content">
        <List>
          { formFieldComponents }
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={this.props.isValid} withIcon={true} label={this.makeSubmitButtonText()} />
          </ListItem>
        </List>
        <NotificationSnackbar />
      </Form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isValid:  state.forms[ownProps.formName].valid,
    formFields: state.forms[ownProps.formName].fields,
    token: state.auth.token,
    resourceNamePlural: state.admin.resource.name.plural,
    resourceNameSingular: state.admin.resource.name.singular
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
    loadFormWithData: (fieldValues, formName, isValid) => {
      dispatch({
        type: 'FORM_LOAD',
        fieldValues,
        formName,
        valid: isValid
      })
    },
    resetForm: (formName) => {
      dispatch ({
        type: 'FORM_RESET',
        formName
      })
    },
    resetValid: (valid, formName) => {
      dispatch ({
        type: 'FORM_VALID',
        formName,
        valid
      })
    },
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm)