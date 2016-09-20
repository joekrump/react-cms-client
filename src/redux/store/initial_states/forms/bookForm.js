export const bookForm = {
  resourcePath: 'books/',
  valid: false,
  fields: {
    title: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Title',
      placeholder: ''
    },
    author_name: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Author Name',
      placeholder: ''
    },
    pages_count: {
      value: '', 
      errors: [], 
      inputType: 'text',
      label: 'Page Count',
      placeholder: ''
    }
  }
}