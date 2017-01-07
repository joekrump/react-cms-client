export const signupForm = {
  resourcePath: 'users/',
  isTyping: false,
  valid: false,
  fields: {
    name: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Name',
      placeholder: '',
      valid: false
    },
    email: {
      value: '', 
      errors: [], 
      inputType: 'email',
      label: 'Email',
      placeholder: '',
      valid: false
    },
    password: {
      value: '', 
      errors: [], 
      inputType: 'password',
      label: 'Password',
      placeholder: '*********',
      valid: false
    }
  }
}