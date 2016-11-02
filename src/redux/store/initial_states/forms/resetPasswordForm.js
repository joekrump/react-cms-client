export const resetPasswordForm = {
  valid: false,
  fields: {
    password: {
      value: '', 
      errors: [], 
      inputType: 'password',
      label: 'New Password',
      placeholder: '*********'
    },
    password_confirmation: {
      value: '', 
      errors: [], 
      inputType: 'password',
      label: 'Confirm New Password',
      placeholder: '*********'
    },
    token: {
      value: '', 
      errors: [], 
      inputType: 'hidden',
      label: '',
      placeholder: ''
    },
    email: {
      value: '', 
      errors: [], 
      inputType: 'hidden',
      label: '',
      placeholder: ''
    }
  }
}