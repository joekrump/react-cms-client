module.exports = {
  bookForm: {
    title: {
      rules: ['required']
    },
    author_name: {
      rules: ['required']
    },
    pages_count: {
      rules: ['required']
    }
  },
  loginForm: {
    email: {
      rules: ['required']
    },
    password: {
      rules: ['required']
    }
  },
  paymentForm: {
    fname: {
      rules: ['required']
    },
    lname: {
      rules: ['required']
    },
    email: {
      rules: ['required']
    },
    amt: {
      rules: ['required']
    }
  },
  permissionForm: {
    name: {
      rules: ['required']
    },
    display_name: {
      rules: ['required']
    },
    description: {
      rules: ['required']
    }
  },
  roleForm: {
    name: {
      rules: ['required']
    },
    display_name: {
      rules: ['required']
    },
    description: {
      rules: ['required']
    }
  },
  userForm: {
    name: {
      rules: ['required']
    },
    email: {
      rules: ['required']
    },
    password: {
      rules: ['required']
    }
  }
}