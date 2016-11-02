// src/form-validation/validations.js
// 
// Find available validation rules at https://github.com/chriso/validator.js
// Note: place rules in the order in which you want the rules to run.
// 
module.exports = {
  bookForm: {
    title: {
      rules: ['isRequired']
    },
    author_name: {
      rules: ['isRequired']
    },
    pages_count: {
      rules: ['isRequired', 'isInt']
    }
  },
  loginForm: {
    email: {
      rules: ['isRequired', 'isEmail']
    },
    password: {
      rules: ['isRequired']
    }
  },
  paymentForm: {
    fname: {
      rules: ['isRequired', 'isValidName']
    },
    lname: {
      rules: ['isRequired', 'isValidName']
    },
    email: {
      rules: ['isRequired', 'isEmail']
    },
    amt: {
      rules: ['isRequired', 'isValidMoney']
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
  forgotPasswordForm: {
    email: {
      rules: ['isRequired', 'isEmail']
    }
  },
  resetPasswordForm: {
    password: {
      rules: ['isRequired']
    },
    password_confirmation: {
      rules: ['isRequired']
    },
    email: {
      rules: ['isRequired']
    },
    token: {
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
  signupForm: {
    name: {
      rules: ['isRequired']
    },
    email: {
      rules: ['isRequired', 'isEmail']
    },
    password: {
      rules: {
        new: ['isRequired'],
        edit: []
      }
    }
  },
  userForm: {
    name: {
      rules: ['isRequired']
    },
    email: {
      rules: ['isRequired', 'isEmail']
    },
    password: {
      rules: {
        new: ['isRequired'],
        edit: []
      }
    }
  }
}