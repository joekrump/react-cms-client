// possible modes: EDIT_INDEX, PASSIVE, EDIT_CONTENT, 'NEW'

const resources = {
  books: {mode: 'PASSIVE', hasChanges: false},  
  users: {mode: 'PASSIVE', hasChanges: false},
  pages: {mode: 'PASSIVE', hasChanges: false},
  cards: {mode: 'PASSIVE', hasChanges: false},
  roles: {mode: 'PASSIVE', hasChanges: false},
  permissions: {mode: 'PASSIVE', hasChanges: false}
}

export default resources;