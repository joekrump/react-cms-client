import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { Form, TextInput, SubmitButton } from '../Form/index';
import APIClient from '../../http/requests'
import NotificationSnackbar from '../Notifications/Snackbar/Snackbar'
import validations from '../../form-validation/validations'

const listItemStyle = {
  padding: "0 16px"
};

class ResourceForm extends React.Component {

  componentWillMount(){
    let client = new APIClient(this.props.dispatch)
    this.setState({client});

    if(this.props.editContext === 'edit'){
      // If a form is loading with editContext of 'edit' the values being loaded into form fields should be valid
      // therefore, the form itself can be set to valid initially.
      // this.props.resetValid(true, this.props.formName);

      client.get(this.props.resourceURL)
      .then((res) => {
        if (res.statusCode !== 200) {
          console.log('Bad response: ', res);
        } else {
          client.updateToken(res.header.authorization);
          this.props.loadFormWithData(res.body.data, this.props.formName, true);
        }
      }, (res) => {
        console.warn('Error getting resource data: ', res);
      })
      .catch((res) => {
        console.warn('Error getting resource data: ', res);
      })
    } else {
      this.resetForm();
    }
  }

  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.submitToServer();
  }
  submitToServer(){
    var formInputValues = {};

    Object.keys(this.props.formFields).forEach((key) => {
      formInputValues[key] = this.props.formFields[key].value;
      return;
    })
    try {
      let httpMethod = this.props.editContext === 'edit' ? 'put' : 'post';

      this.state.client[httpMethod](this.props.resourceURL, true, {data: formInputValues})
      .then((res) => {
        if (res.statusCode !== 200) {
          this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
        } else {
          this.handleSuccess(res);
        }
      }, (res) => {
        this.props.updateSnackbar(true, 'Error', 'ERROR!', 'warning');
      })
      .catch((res) => {
        console.log(res);
        this.props.updateSnackbar(true, 'Error', res.data, 'error');
      })
    } catch (e) {
      console.log('Exception: ', e)
    }
  }
  handleSuccess(res) {
    
    if(this.props.editContext === 'edit') {
      this.props.updateSnackbar(true, 'Success', 'Update Successful', 'success');
    } else {
      this.props.updateSnackbar(true, 'Success', 'Added Successfully', 'success');
    }

    if(this.props.loginCallback) {
      this.props.loginCallback(res.body.user, res.body.token)
    } else {
      if(this.props.editContext !== 'edit'){
        setTimeout(() => this.resetForm(), 500);
      }
    }
  }

  getFieldValidationRules(fieldName){
    return validations[this.props.formName][fieldName].rules[this.props.editContext] !== undefined ? 
                validations[this.props.formName][fieldName].rules[this.props.editContext] :
                validations[this.props.formName][fieldName].rules
  }

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
            validationRules={this.getFieldValidationRules(fieldName)} 
            autoFocus={i++ === 0} 
            multiLine={field.inputType === 'textarea'}
          />
        </ListItem>
      );
    });

    return (
      <Form onSubmit={(event) => this.handleFormSubmit(event)} className="form-content">
        <List>
          { formFieldComponents }
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={this.props.isValid} withIcon={true} label={this.props.editContext === 'edit' ? 'Update' : 'Create'}/>
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
    resourceNamePlural: state.admin.resource.name.plural
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