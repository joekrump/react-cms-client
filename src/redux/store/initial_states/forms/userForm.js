export const userForm = {
  resourcePath: 'users/',
  valid: false,
  completed: false,
  fields: {
    name: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Name',
      placeholder: ''
    },
    email: {
      value: '', 
      errors: [], 
      inputType: 'email',
      label: 'Email',
      placeholder: ''
    },
    password: {
      value: '', 
      errors: [], 
      inputType: 'password',
      label: 'Password',
      placeholder: '*********'
    }
  }
}