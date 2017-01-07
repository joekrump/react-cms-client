// src/components/Form/TextInput.js
// 
import React from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import Validator from '../../form-validation/validator'
import { updateFormValidationStatus } from '../../redux/actions/form';
const style = {
  display: 'block'
}

const TextInput = () => ({
  updateValue(value) {
    // Handle the input change and dispatch redux method to update field value as well as errors
    let errors = this.checkIfValid(value);
    this.props.handleInputChange(value, this.props.name, this.props.formName, this.checkIfValid(value), false, (errors.length > 0));
    this.timeout = null;
  },

  handleInputChange(event) {
    this.updateValueAfterTypingStops();
  },
  updateValueAfterTypingStops() {
    this.props.handleInputChange(this.textInput.input.value, this.props.name, this.props.formName, () => ([]), true, false);
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(this.timeout);

    // Make a new timeout set to go off in 300ms
    this.timeout = setTimeout(() => {
      this.updateValue(this.textInput.input.value);
    }, 300);
  },

  checkIfValid(value){
    let errors = [];
    let validationResult = null;
    // Run validation rules for the field if there are any
    // 
    if(this.props.validationRules) {
      for(let i = 0; i < this.props.validationRules.length; i++){
        validationResult = this.validateInput(value, i);
        if(validationResult.reason !== null) {
          errors.push(validationResult.reason);
          break;
        }
      }
    }
    return errors;
  },
  validateInput(value, i){
    let rule = this.props.validationRules[i];

    return Validator[rule](
      value, 
      this.getOptionsForRule([this.props.validationRules[i]])
    );
  },
  getOptionsForRule(ruleName){
    return this.props.validationOptions ? this.props.validationOptions[ruleName] : undefined;
  },
  getErrors(){
    if(this.props.errors.length > 1) {
      return this.makeErrorComponent(this.props.errors.join(', '));
    } else if(this.props.errors.length > 0) {
      return this.makeErrorComponent(this.props.errors[0]);
    } else {
      return null;
    }
  },

  makeErrorComponent(errorText){
    return (<span style={{color: 'red'}}>{errorText}</span>)
  },

  render(){
    let errors = this.getErrors();
    return (
      <div className="text-field">
        <TextField
          ref={(input) => { this.textInput = input; }}
          style={style}
          type={this.props.type ? this.props.type : 'text'}
          hintText={this.props.placeholder}
          floatingLabelText={this.props.label}
          onChange={(e) => this.handleInputChange(e)}
          errorText={errors}
          value={this.props.value}
          multiLine={this.props.multiLine}
          autoFocus={this.props.autoFocus !== undefined && this.props.autoFocus}
        />
      </div>
    );
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.forms[ownProps.formName].fields[ownProps.name].value,
    errors: state.forms[ownProps.formName].fields[ownProps.name].errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (value, fieldName, formName, errors, isTyping, fieldIsValid) => {
      dispatch ({
        type: 'FORM_INPUT_CHANGE',
        value,
        fieldName,
        formName,
        errors,
        isTyping,
        fieldIsValid
      })
    },
    updateFormValidationStatus: (valid, formName) => {
      dispatch(updateFormValidationStatus(valid, formName));
    }
  };
}

const TextInputRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextInput)

export {TextInputRedux as TextInput}