export const userForm = {
  resourcePath: 'users/',
  valid: false,
  completed: false,
  fields: {
    name: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Name',
      placeholder: ''
    },
    email: {
      value: '', 
      errors: null, 
      inputType: 'email',
      label: 'Email',
      placeholder: ''
    },
    password: {
      value: '', 
      errors: null, 
      inputType: 'password',
      label: 'Password',
      placeholder: '*********'
    }
  }
}