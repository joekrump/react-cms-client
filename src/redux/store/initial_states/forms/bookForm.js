export const bookForm = {
  resourcePath: 'books/',
  valid: false,
  isTyping: false,
  fields: {
    title: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Title',
      placeholder: '',
      valid: false
    },
    author_name: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Author Name',
      placeholder: '',
      valid: false
    },
    pages_count: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Page Count',
      placeholder: '',
      valid: false
    }
  }
}