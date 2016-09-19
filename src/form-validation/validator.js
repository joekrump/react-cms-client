// src/form-validation/Validator.js
import validator from 'validator'
import {valid, invalid} from '../helpers/ValidationHelper'

const Validator = {
  isEmail: (value) => {
    return (validator.isEmail(value)) ?
      valid() : invalid('Please enter a valid email.')
  },
  isRequired: (value) => {
    return (value != null && value.length > 0) ?
      valid() : invalid('This field is required')
  },
  hasNumber: (value) => {
    return (value != null && value.match(/.*[0-9]+.*/i) != null) ?
      valid() : invalid('This field should contain at least one digit.')
  },
  hasLength: (value, {min, max}) => {
    if (value == null) {
      return invalid('Value cannot be null.')
    }
    if (min != null && value.length < min) {
      return invalid(`Length should be at least ${min}.`)
    }
    if (max != null && value.length > max) {
      return invalid(`Length should be at most ${max}.`)
    }
    return valid()
  },
  areSame: (value1, value2) => {
    return value1 === value2 ?
      valid() : invalid('Values do not match.')
  }
}

export default Validator;














