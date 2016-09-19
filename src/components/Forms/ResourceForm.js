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
  constructor(props) {
    super(props);
    this.state = {
      existingData: {}
    }
  }

  componentDidMount(){
    let client = new APIClient(this.context.store)
    this.setState({client});

    if(this.props.context === 'edit'){

      client.get(this.props.resourceNamePlural + '/' + this.props.resourceId)
      .then((res) => {
        if (res.statusCode !== 200) {
          console.log('Bad response: ', res);
        } else {
          // this.setState({existingData: res.body.data})
          client.updateToken(res.header.authorization);
          this.props.loadFormWithData(res.body.data, this.props.formName);
        }
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
      let httpMethod = this.props.context === 'edit' ? 'put' : 'post';

      this.state.client[httpMethod](this.props.submitUrl, true, {data: formInputValues})
      .then((res) => {
        if (res.statusCode !== 200) {
          this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
        } else {
          this.handleSuccess(res);
        }
      })
      .catch((res) => {
        this.props.updateSnackbar(true, 'Error', res.body.message, 'error');
      })
    } catch (e) {
      console.log('Exception: ', e)
    }
  }
  handleSuccess(res) {
    this.props.updateFormCompleteStatus(
      true, 
      this.props.formName
    );
    
    if(this.props.context === 'edit') {
      this.props.updateSnackbar(true, 'Success', 'Update Successful', 'success');
    } else {
      this.props.updateSnackbar(true, 'Success', 'Added Successfully', 'success');
    }

    if(this.props.loginCallback) {
      this.props.loginCallback(res.body.user, res.body.token)
    } else {
      if(this.props.context !== 'edit'){
        setTimeout(() => this.resetForm(), 500);
      }
    }
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
            validations={validations[this.props.formName][fieldName]} 
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
            <SubmitButton isFormValid={this.props.formValid} withIcon={true} label={this.props.context === 'edit' ? 'Update' : 'Create'}/>
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
}

const mapStateToProps = (state, ownProps) => {
  return {
    formValid:  state.forms[ownProps.formName].valid,
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

ResourceForm.contextTypes = {
  store: React.PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm)