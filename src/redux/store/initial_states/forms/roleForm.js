export const roleForm = {
  resourcePath: 'roles/',
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
    display_name: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Display Name',
      placeholder: ''
    },
    description: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Description',
      placeholder: ''
    }
  }
}