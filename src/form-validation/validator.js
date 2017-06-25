// src/form-validation/Validator.js
import { isEmail,  isInt, isFloat } from "validator"
import { valid, invalid } from "../helpers/ValidationHelper"

const Validator = {
  isEmail: (value) => {
    return (isEmail(value)) ?
      valid() : invalid("Please enter a valid email.")
  },
  isRequired: (value) => {
    return (value != null && (value.trim().length > 0)) ?
      valid() : invalid("This field is required")
  },
  isValidName: (value) => {
    // Check to see if any of the characters in the regex are in the string value.
    // If they are, give a message that says that they are not allowed.
    let result = String(value).match(/([^±!@£$%^&*_+§¡€#¢§¶•ªº«/\\<>?:;|()=.,]*$)/)
    return result.index === 0 ?
      valid() : invalid(`This field may not contain ${result.input[result.index - 1]}`)
  },
  /**
   * Check if the value is a valid money amount
   * @param  {Number}  value   - the entry being checked    
   * @param  {Object}  options - ex. {min: 10, max: 30}
   * @return {Boolean}         [description]
   */
  isValidMoney(value, options) {
    return isInt(value, options) || isFloat(value, options) ?
      valid() : invalid(`Value must be a number and at least ${options.min}`)
  },
  hasNumber: (value) => {
    return (value != null && value.match(/.*[0-9]+.*/i) != null) ?
      valid() : invalid("This field should contain at least one digit.")
  },
  hasLength: (value, compareValues) => {
    if (value == null) {
      return invalid("Value cannot be null.")
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
      valid() : invalid("Values do not match.")
  },
  isInt: (value) => {
    return isInt(value) ? valid() : invalid("Value must be an integer.")
  }
}

export default Validator;
