import React from 'react';
import Validation from 'react-validation';
import merge from 'lodash.merge';

merge(Validation.rules, {
    // Key name maps the rule 
    required: {
        // Function to validate value 
        rule: (value, component, form) => {
            return value.trim();
        },
        // Function to return hint 
        // You may use current value to inject it in some way to the hint 
        hint: value => {
            return 'Required';
        }
    },
    email: {
        // Example usage with external 'validator' 
        rule: value => {
            return validator.isEmail(value);
        },
        hint: value => {
            return <span className='form-error is-visible'>{value} isnt an Email.</span>
        }
    },
    // This example shows a way to handle common task - compare two fields for equality 
    password: {
        // rule function can accept 2 extra arguments: 
        // component - current checked component 
        // form - form component which has 'states' inside native 'state' object 
        rule: (value, component, form) => {
            // form.state.states[name] - name of corresponding field 
            let password = form.state.states.password;
            let passwordConfirm = form.state.states.passwordConfirm;
            // isUsed, isChanged - public properties 
            let isBothUsed = password && passwordConfirm && password.isUsed && passwordConfirm.isUsed;
            let isBothChanged = isBothUsed && password.isChanged && passwordConfirm.isChanged;
 
            if (!isBothUsed || !isBothChanged) {
                return true;
            }
 
            return password.value === passwordConfirm.value;
        },
        hint: value => {
            return <span className='form-error is-visible'>Passwords should be equal.</span>
        }
    }
})