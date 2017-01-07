export const permissionForm = {
  resourcePath: 'permissions/',
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
    display_name: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Display Name',
      placeholder: '',
      valid: false
    },
    description: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Description',
      placeholder: '',
      valid: false
    }
  }
}