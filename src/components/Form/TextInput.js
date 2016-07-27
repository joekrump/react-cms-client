// src/components/Form/TextOm[it.js
import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';

export default React.createClass({
  displayName: 'TextInput',

  propTypes: {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string
  },

  updateValue(value) {
    this.context.update(this.props.name, value);
  },

  handleChange(event) {
    this.updateValue(event.target.value)
  },

  render() {
    return (
      <div>
        <TextField
          hintText={this.props.placeholder}
          floatingLabelText={this.props.label}
          onChange={this.handleChange}
        />
      </div>
    );
  }
});

const maptStateToProps = (state) => {
  return {
    value: state.value,
    errorMessage: state.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onInputChange: (formName, fieldName) => {
      dispatch ({
        type: 'FORM_INPUT_CHANGE',
        formName: formName,
        fieldName: fieldName
      })
    }
  };
}