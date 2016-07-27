// src/components/Form/TextOm[it.js
import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';

export default React.createClass({
  displayName: 'Text',

  propTypes: {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string
  },

  contextTypes: {
    update: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
  },

  updateValue(value) {
    this.context.update(this.props.name, value);
  },

  onChange(event) {
    this.updateValue(event.target.value)
  },

  render() {
    return (
      <div>
        <TextField
          hintText={this.props.placeholder}
          floatingLabelText={this.props.label}
          value={this.context.values[this.props.name]}
          onChange={this.onChange}
        />
      </div>
    );
  }
});