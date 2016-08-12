**l-api-v2** is a SPA frontend interface for an API using JWT for authentication and implements the following: 
- [ReactJS](https://facebook.github.io/react/)
- [React Router](https://github.com/reactjs/react-router)
- [Redux](http://redux.js.org)
- [React Redux](https://github.com/reactjs/react-redux)
- [react-router-redux](https://github.com/reactjs/react-router-redux)
- [Material UI](http://www.material-ui.com/)
- [SuperAgent](https://github.com/visionmedia/superagent)
- [Stripe](https://stripe.com/)

The dev environment for the app was created using [react-create-app](https://github.com/facebookincubator/create-react-app), an excellent tool for generating a skeleton React app with all the basic configuration taken care of. Visit the url above for more details. Redux Devtools are also used in dev environment.

CRUD admin interface is setup to be generic. 

## Setup Instructions

1. Install node modules by running: 
```bash
$ npm install
```

2. Create app_config directory in the project root:
```bash
$ mkdir app_config
```

3. Create two config files: `app.js` and `stripe.js` with the following content:
- `app.js`:
```javascript
const app_config = {
  baseUrl: 'THE PATH OF THE CLIENT: ex. http://localhost:3000', // Note: If you are unsure what this is, try running `npm start` to see.
  apiBaseUrl: 'THE PATH TO YOUR API SERVER (followed by a trailing slash "/"): ex. http://localhost:8000/api/',
  adminRouteLinks: [
    { linkText: 'Dashboard', url: '/admin' },
    // Add more that you would like here ex. { linkText: 'Users', url: '/admin/users' } or { linkText: 'Books', url: '/admin/books' }
  ],
  publicRouteLinks: [
    { linkText: 'Log In', url: '/login' },
    { linkText: 'Home', url: '/' },
    { linkText: 'About', url: '/about' },
    { linkText: 'Make a payment', url: '/donate' },
    // Add more here (BUT UNLIKE THE ADMIN ROUTES, MAKE SURE YOU ADD TO routes.js as well)
  ],
  validResources: [
    'users',
    'books',
    'permissions',
    'roles'
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

### Ongoing Work

Route permissions are still a WIP and will utilize roles


### Goals

Add CRUD interface for pages
Add Searching and Reordering of resources
Add Media Management, including image manipulation