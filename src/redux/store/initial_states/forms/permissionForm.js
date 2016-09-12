export const permissionForm = {
  resourcePath: 'permissions/',
  submitDisabled: false,
  completed: false,
  error: null,
  fields: {
    name: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Name',
      placeholder: ''
    },
    display_name: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Display Name',
      placeholder: ''
    },
    description: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Description',
      placeholder: ''
    }
  }
}