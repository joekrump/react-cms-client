export const permissionForm = {
  resourcePath: 'permissions/',
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