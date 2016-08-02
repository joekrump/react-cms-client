**l-api-v2** is a SPA frontend interface for an API using JWT for authenication and implements the following: 
- [ReactJS](https://facebook.github.io/react/)
- [React Router](https://github.com/reactjs/react-router)
- [Redux](http://redux.js.org)
- [React Redux](https://github.com/reactjs/react-redux)
- [react-router-redux](https://github.com/reactjs/react-router-redux)
- [Material UI](http://www.material-ui.com/)
- [SuperAgent](https://github.com/visionmedia/superagent)
- [Stripe](https://stripe.com/)

The dev environment for the app was created using [react-create-app](https://github.com/facebookincubator/create-react-app), an excellent tool for generating a skeleton React app with all the basic configuration taken care of. Visit the url above for more details. Redux Devtools are also used in dev environment.


## Setup Instructions

1. Install node modules by running: 
```bash
$ npm install
```

2. Create config directory in the project root:
```bash
$ mkdir config
```

3. Create two config files: `app.js` and `stripe.js` with the following content:
- `app.js`:
```javascript
const app_config = {
  baseUrl: 'THE PATH THAT TO CLIENT: ex. http://localhost:3000', // If you are unsure what this is, try running `npm start` to see.
  apiBaseUrl: 'THE PATH TO YOUR API SERVER (followed by a trailing slash "/"): ex. http://localhost:4000/api/',
  adminRouteLinks: [
    { linkText: 'Dashboard', url: '/admin' },
    { linkText: 'Users', url: '/admin/users' },
    { linkText: 'Books', url: '/admin/books' }
  ],
  publicRouteLinks: [
    { linkText: 'Log In', url: '/login' },
    { linkText: 'Home', url: '/' },
    { linkText: 'Inbox', url: '/inbox' },
    { linkText: 'About', url: '/about' },
    { linkText: 'Make a payment', url: '/donate' },
    { linkText: 'Redux Counter', url: '/redux-counter' }
  ],
  validResources: [
    'users',
    'books'
  ]
};

module.exports = app_config;
```

- `stripe.js`:
```javascript
var stripe_config = {
  test: {
    pk: 'YOUR STRIPE TEST PUBLIC KEY'
  }
};

module.exports = stripe_config; 
```

**NOTE** This app currently requires [Stripe](https://stripe.com/) for payments to be set up.

4. Start Client App
```bash
$ npm start
```