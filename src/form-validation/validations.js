module.exports = {
  bookForm: {
    title: {
      rules: ['isRequired']
    },
    author_name: {
      rules: ['isRequired']
    },
    pages_count: {
      rules: ['isRequired']
    }
  },
  loginForm: {
    email: {
      rules: ['isRequired']
    },
    password: {
      rules: ['isRequired']
    }
  },
  paymentForm: {
    fname: {
      rules: ['isRequired']
    },
    lname: {
      rules: ['isRequired']
    },
    email: {
      rules: ['isRequired']
    },
    amt: {
      rules: ['isRequired']
    }
  },
  permissionForm: {
    name: {
      rules: ['isRequired']
    },
    display_name: {
      rules: ['isRequired']
    },
    description: {
      rules: ['isRequired']
    }
  },
  roleForm: {
    name: {
      rules: ['isRequired']
    },
    display_name: {
      rules: ['isRequired']
    },
    description: {
      rules: ['isRequired']
    }
  },
  userForm: {
    name: {
      rules: ['isRequired']
    },
    email: {
      rules: ['isRequired']
    },
    password: {
      rules: ['isRequired']
    }
  }
}