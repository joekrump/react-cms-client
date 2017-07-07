// src/componetns/Forms/PaymentForm/PaymentForm.js
import React from "react";
import { APIClient } from "../../../http/requests";
import { connect } from "react-redux";
// Icons
import CreditCardIcon from "material-ui/svg-icons/action/credit-card";
import VerifiedUserIcon from "material-ui/svg-icons/action/verified-user";

// mui components
import { List } from "material-ui/List";
import CircularProgress from "material-ui/CircularProgress";
import StripeFields from "./StripeFields";
import { Form, TextInput, SubmitButton } from "../../Form/index";
import validations from "../../../form-validation/validations"
import FirstNameField from "./fields/FirstName";
import LastNameField from "./fields/LastName";
import EmailField from "./fields/EmailField";
import DisabledListItem from "./DisabledListItem.js"

const stripeScriptURL = "https://js.stripe.com/v3/";
const formName = "paymentForm";
const listItemStyle = { padding: "0 16px" };
const StyledListItem = (props) => (
  <DisabledListItem style={listItemStyle} {...props} />
);

class PaymentForm extends React.Component {

  constructor (props){
    super(props);
    this.apiClient = new APIClient(this.props.dispatch);
    this.resetForm = this.resetForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.submitToServer = this.submitToServer.bind(this);
  }

  componentDidMount() {
    this.resetForm();
    const elements = this.stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
  }

  resetForm(){
    this.props.resetForm();
  }

  handleFormSubmit(e) {
    e.preventDefault();
    // eslint-disable-next-line
    this.stripe.createToken(e.target).then((token) => {
      this.props.updateStripeToken(token);
      this.submitToServer(token);
    }).catch((error) => {
      this.props.updateSnackbar(true, "Error", response.error.message, "error");
    });
  }

  getFormFieldValues() {
    return Object.keys(this.props.formFields).map((key) => {
      this.props.formFields[key].value;
    });
  }

  handleUnprocessibleEntityResponse(res) {
    this.props.updateSnackbar(true, "Error", res.body.message, "error");

    Object.keys(res.body.errors).forEach((fieldName) => {
      this.props.inputError(res.body.errors[fieldName],
        fieldName,
        formName,
      );
    });
  }

  handleSaveUnsuccessful() {
    this.props.updateSnackbar(true, "Error", "Could Not Process Payment", "error");
  }

  handleUnexpectedServerError() {
    this.props.updateSnackbar(true, "Error", "Something Unexpected Happened", "error");
  }

  handleSaveErrors(res) {
    if (res.statusCode === 422) {
      this.handleUnprocessibleEntityResponse(res);
    } else if (res.statusCode !== 200) {
      this.handleSaveUnsuccessful();
    } else {
      this.handleUnexpectedServerError();
    } 
  }

  handleSaveSuccessful() {
    this.props.updateSnackbar(true, "Success", "Payment Processed", "success");
    this.props.updateFormCompleteStatus(true);
    setTimeout(this.resetForm, 3000);
  }

  handleSaveException(e) {
    console.error(e);
  }

  buildPostBody(stripeToken) {
    return {
      data: {
        token: stripeToken,
        ...this.getFormFieldValues(),
      },
    };
  }

  submitToServer(stripeToken){
    const authRequired = false;
    const paymentUrl = "stripe/make-payment";
    const payload = this.buildPostBody(stripeToken);
    
    this.apiClient.post(
      paymentUrl, 
      authRequired,
      payload,
    ).then(
      res => this.handleSaveSuccessful(), 
      res => this.handleSaveErrors(res)
    ).catch(e => handleSaveException(e));
  }

  render() {
    const StripeFieldListItems = StripeFields.map((StripeField, i) => (
      <StyledListItem key={`stripe-field-${i}`}>
        { StripeField }
      </StyledListItem>
    ));

    return (
      <Form onSubmit={this.handleFormSubmit} className="payment-content">
        <List>
          <DisabledListItem 
            className="payment-header"
            primaryText={<h2 className="li-primary-text">Your Details</h2>}
            leftIcon={<VerifiedUserIcon color={"#fff"}/>}
            disabled={true}
            disableKeyboardFocus={true}
          />
          <StyledListItem>
            <FirstNameField 
              validationRules={validations[formName].fname.rules}
              formName={formName}
            />
          </StyledListItem>
          <StyledListItem>
            <LastNameField 
              validationRules={validations[formName].lname.rules}
              formName={formName}
            />
          </StyledListItem>
          <StyledListItem>
            <EmailField 
              validationRules={validations[formName].email.rules}
              formName={formName}
            />
          </StyledListItem>
        </List>
        <List>
          <DisabledListItem
            className="payment-header" 
            primaryText={<h2 className="li-primary-text">Payment Details</h2>}
            leftIcon={<CreditCardIcon color={"#fff"}/>}
          />
          <StyledListItem>
            <TextInput placeholder="Ex. 5.00" label="Amount in dollars (CAD)" formName={formName} 
              name="amt"
              validationRules={validations[formName].amt.rules}
              validationOptions={{isValidMoney: {min: 5}}}
            />
          </StyledListItem>
          {/* STRIPE FIELDS TO GO HERE */}
          { StripeFieldListItems }
          <StyledListItem>
            <SubmitButton 
              isFormValid={this.props.isFormValid && !this.props.submitDisabled}
              withIcon={true}
              label="Submit Payment"
            />
          </StyledListItem>
        </List>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  formFields:  state.forms.paymentForm.fields,
  isFormValid: state.forms.paymentForm.valid,
  stripeToken: state.paymentReducer.stripeToken
});

const mapDispatchToProps = (dispatch) => ({
  updateStripeToken: (stripeToken) => {
    dispatch ({
      type: "UPDATE_STRIPE_TOKEN",
      stripeToken
    })
  },
  updateFormCompleteStatus: (valid) => {
    dispatch ({
      type: "FORM_VALID",
      valid,
      formName: formName
    })
  },
  updateSnackbar: (show, header, content, notificationType) => {
    dispatch ({
      type: "UPDATE_SNACKBAR",
      show,
      header,
      content,
      notificationType
    })
  },
  resetForm: () => {
    dispatch ({
      type: "FORM_RESET",
      formName: formName
    })
  },
  inputError: (errors, fieldName, formName) => {
    dispatch({
      type: "FORM_INPUT_ERROR",
      errors,
      fieldName,
      formName
    })
  },
  dispatch,
});

const PaymentFormRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentForm);

export { PaymentFormRedux as PaymentForm };
