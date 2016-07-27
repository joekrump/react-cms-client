// src/components/Form/TextOm[it.js
import React from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';

const TextInput = () => ({
  updateValue(value) {
    this.props.handleInputChange(value, this.props.name, this.props.formName);
  },

  handleInputChange(event) {
    // console.log(event.target.value);
    this.updateValue(event.target.value)
  },

  render(){
    return (
      <div>
        <TextField
          type={this.props.type ? this.props.type : 'text'}
          hintText={this.props.placeholder}
          floatingLabelText={this.props.label}
          onChange={(e) => this.handleInputChange(e)}
          errorText={this.props.errorText}
        />
      </div>
    );
  }
});

const maptStateToProps = (state) => {
  return {
    value: state.value,
    errorText: state.errorText
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (value, fieldName, formName) => {
      dispatch ({
        type: 'FORM_INPUT_CHANGE',
        value,
        fieldName,
        formName
      })
    }
  };
}

const TextInputRedux = connect(
  maptStateToProps,
  mapDispatchToProps
)(TextInput)

export {TextInputRedux as TextInput}