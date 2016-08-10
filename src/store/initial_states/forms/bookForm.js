export const bookForm = {
  resourcePath: 'books/',
  submitDisabled: false,
  completed: false,
  error: null,
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
    page_count: {
      value: '', 
      errors: null, 
      inputType: 'text',
      label: 'Page Count',
      placeholder: ''
    }
  }
}