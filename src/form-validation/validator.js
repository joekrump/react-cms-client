// src/form-validation/Validator.js
import validator from 'validator'
import {valid, invalid} from '../helpers/ValidationHelper'

const Validator = {
  isEmail: (value) => {
    return (validator.isEmail(value)) ?
      valid() : invalid('Please enter a valid email.')
  },
  isRequired: (value) => {
    return (value != null && (value.trim().length > 0)) ?
      valid() : invalid('This field is required')
  },
  hasNumber: (value) => {
    return (value != null && value.match(/.*[0-9]+.*/i) != null) ?
      valid() : invalid('This field should contain at least one digit.')
  },
  hasLength: (value, compareValues) => {
    if (value == null) {
      return invalid('Value cannot be null.')
    }
    if (compareValues.min != null && value.length < compareValues.min) {
      return invalid(`Length should be at least ${compareValues.min}.`)
    }
    if (compareValues.max != null && value.length > compareValues.max) {
      return invalid(`Length should be at most ${compareValues.max}.`)
    }
    return valid()
  },
  areSame: (value1, compareValues) => {
    return value1 === compareValues.areSameValue ?
      valid() : invalid('Values do not match.')
  }
}

export default Validator;














