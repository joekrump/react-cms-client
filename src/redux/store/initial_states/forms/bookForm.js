export const bookForm = {
  resourcePath: 'books/',
  valid: false,
  completed: false,
  fields: {
    title: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Title',
      placeholder: ''
    },
    author_name: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Author Name',
      placeholder: ''
    },
    pages_count: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Page Count',
      placeholder: ''
    }
  }
}