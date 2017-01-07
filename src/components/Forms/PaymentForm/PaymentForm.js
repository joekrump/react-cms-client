// src/componetns/Forms/PaymentForm/PaymentForm.js
// 
import React from 'react';
import APIClient from '../../../http/requests'
import { connect } from 'react-redux';

// Icons
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import VerifiedUserIcon from 'material-ui/svg-icons/action/verified-user';

// mui components
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import StripeFields from './StripeFields';
import { Form, TextInput, SubmitButton } from '../../Form/index';
import StripeConfig from '../../../../app_config/stripe';
import { loadScript } from '../../../helpers/ScriptsHelper'
import validations from '../../../form-validation/validations'

const listItemStyle = {
  padding: "0 16px"
};
const stripeScriptURL = 'https://js.stripe.com/v2/';
const formName = "paymentForm";

class PaymentForm extends React.Component {

  constructor (props){
    super(props)
    this.resetForm = this.resetForm.bind(this)
    this.getStripeToken = this.getStripeToken.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.submitToServer = this.submitToServer.bind(this)
    
    // if the form is being displayed in edit mode, no nead to actually load Stripe into the page.
    // 
    if(props.editMode) {
      this.state = {
        stripeLoading: false,
        stripeLoadingError: false
      }
    } else if (typeof Stripe === 'undefined') {
      this.state = {
        stripeLoading: true,
        stripeLoadingError: false
      }

      loadScript(stripeScriptURL, () => {
        if (!this.getStripeToken()) {
          // Put your publishable key here
          // eslint-disable-next-line
          Stripe.setPublishableKey(StripeConfig.test.pk);
          this.setState({ stripeLoading: false, stripeLoadingError: false });
        }
      },
      () => this.setState({ stripeLoading: false, stripeLoadingError: true }));
    } else {
      this.state = {
        stripeLoading: false,
        stripeLoadingError: false
      }
    }
  }
  componentDidMount() {
    // Reset the form initially.
    this.resetForm();
    let client = new APIClient(this.props.dispatch);
    this.setState({client});
  }
  resetForm(){
    this.props.resetForm()
  }
  getStripeToken() {
    return this.props.stripeToken
  }
  handleFormSubmit(e) {
    e.preventDefault();
    // Submit CC fields to Stripe for processing.
    // eslint-disable-next-line
    Stripe.createToken(e.target, function(status, response) {
      if (response.error) {
        // this.props.updatePaymentError(response.error.message)
        this.props.updateSnackbar(true, 'Error', response.error.message, 'error');
      }
      else {
        this.props.updateStripeToken(response.id);
        // If Stripe processing was successful and has returned a token (response.id) the submit
        // Charge to the server for processing.
        this.submitToServer(response.id, this);
      }
    }.bind(this));
  }
  submitToServer(stripeToken, self){
    this.state.client.post('stripe/make-payment', false, {
      data: {
        token: stripeToken, 
        ...self.state.formFields
      }})
      .then((res) => {
        // self.props.updatePaymentError(null);
        self.props.updateSnackbar(true, 'Success', 'Payment Processed', 'success');
        self.props.updateFormCompleteStatus(true);
        setTimeout(self.resetForm, 3000);
      }, (res) => {
        if (res.statusCode === 422) {
          self.props.updateSnackbar(true, 'Error', res.body.message, 'error');

          Object.keys(res.body.errors).forEach((fieldName) => {
            this.props.inputError(res.body.errors[fieldName],
                                  fieldName,
                                  formName);
          });
        } else if (res.statusCode !== 200) {
          
          self.props.updateSnackbar(true, 'Error', 'Could Not Process Payment', 'error');
        } else {
          self.props.updateSnackbar(true, 'Error', 'Something Unexpected Happened', 'error');
        } 
      }).catch((err) => {
       console.log(err);
      })
  }
  render() {
    let StripeFieldListItems = StripeFields.map((StripeField, i) => {
      return (
        <ListItem key={'stripe-field-' + i} disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
          {StripeField}
        </ListItem>
      );
    })

    if (this.state.stripeLoading) {
      return (
        <div className="payment-content">
          <h3 className="payment-header">Loading Payment System...</h3>
          <div>
            <CircularProgress size={1.0} />
          </div>
        </div>
      );
    } else {
      return (
        <Form onSubmit={this.handleFormSubmit} className="payment-content">
          <List>
            <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Your Details</h2>} leftIcon={<VerifiedUserIcon color={'#fff'}/>} disabled={true} disableKeyboardFocus={true} />
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="First Name" label="First Name" formName={formName} 
                name="fname"
                validationRules={validations[formName].fname.rules}
                autoFocus={true}
                />
            </ListItem>
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="Last Name" label="Last Name" formName={formName} 
                name="lname"
                validationRules={validations[formName].lname.rules}
                />
            </ListItem>
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="Email" label="Email" formName={formName} 
                name="email"
                validationRules={validations[formName].email.rules}
              />
            </ListItem>
          </List>
          <List>
            <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Payment Details</h2>} leftIcon={<CreditCardIcon color={'#fff'}/>} disabled={true} disableKeyboardFocus={true} />
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="Ex. 5.00" label='Amount in dollars (CAD)' formName={formName} 
                name="amt"
                validationRules={validations[formName].amt.rules}
                validationOptions={{isValidMoney: {min: 5}}}
              />
            </ListItem>
            {/* STRIPE FIELDS TO GO HERE */}
            { StripeFieldListItems }
            <ListItem disabled={true} disableKeyboardFocus={true}>
              <SubmitButton isFormValid={this.props.isFormValid && !this.props.submitDisabled} withIcon={true} label="Submit Payment"/>
            </ListItem>
          </List>
        </Form>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isFormValid: state.forms.paymentForm.valid,
    stripeToken: state.payments.stripeToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateStripeToken: (stripeToken) => {
      dispatch ({
        type: 'UPDATE_STRIPE_TOKEN',
        stripeToken
      })
    },
    updateFormCompleteStatus: (valid) => {
      dispatch ({
        type: 'FORM_VALID',
        valid,
        formName: formName
      })
    },
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
    dispatch
  };
}

const PaymentFormRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentForm)

export {PaymentFormRedux as PaymentForm}