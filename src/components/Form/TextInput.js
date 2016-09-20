// src/components/Form/TextInput.js
// 
import React from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import Validator from '../../form-validation/Validator'

const TextInput = () => ({
  updateValue(value) {
    // Handle the input change and dispatch redux method to update field value as well as errors
    this.props.handleInputChange(value, this.props.name, this.props.formName, this.checkIfValid(value));
  },

  handleInputChange(event) {
    this.updateValue(event.target.value)
  },

  checkIfValid(value){
    let errors = [];
    let validationResult = null;
    // Run validation rules for the field if there are any
    if(this.props.validationRules) {
      for(let i = 0; i < this.props.validationRules.length; i++){
        validationResult = Validator[this.props.validationRules[i]](value, this.props.compareValues);
        if(validationResult.reason !== null) {
          errors.push(validationResult.reason);
          break;
        }
      }
    }
    return errors;
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
      <div>
        <TextField
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
    handleInputChange: (value, fieldName, formName, errors) => {
      dispatch ({
        type: 'FORM_INPUT_CHANGE',
        value,
        fieldName,
        formName,
        errors
      })
    }
  };
}

const TextInputRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextInput)

export {TextInputRedux as TextInput}