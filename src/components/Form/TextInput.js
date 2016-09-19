// src/components/Form/TextOm[it.js
import React from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';

const TextInput = () => ({
  updateValue(value) {
    this.props.handleInputChange(value, this.props.name, this.props.formName);
  },

  handleInputChange(event) {
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
    errorText: state.forms[ownProps.formName].fields[ownProps.name].errors
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
  mapStateToProps,
  mapDispatchToProps
)(TextInput)

export {TextInputRedux as TextInput}