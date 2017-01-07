export const resetPasswordForm = {
  valid: false,
  isTyping: false,
  fields: {
    password: {
      value: '', 
      errors: [], 
      inputType: 'password',
      label: 'New Password',
      placeholder: '*********',
      valid: false
    },
    password_confirmation: {
      value: '', 
      errors: [], 
      inputType: 'password',
      label: 'Confirm New Password',
      placeholder: '*********',
      valid: false
    },
    token: {
      value: '', 
      errors: [], 
      inputType: 'hidden',
      label: '',
      placeholder: '',
      valid: false
    },
    email: {
      value: '', 
      errors: [], 
      inputType: 'hidden',
      label: '',
      placeholder: '',
      valid: false
    }
  }
}