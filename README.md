**l-api-v2** is a SPA frontend interface for an API using JWT for authentication and implements the following: 
- [ReactJS](https://facebook.github.io/react/)
- [React Router](https://github.com/reactjs/react-router)
- [Redux](http://redux.js.org)
- [React Redux](https://github.com/reactjs/react-redux)
- [react-router-redux](https://github.com/reactjs/react-router-redux)
- [Material UI](http://www.material-ui.com/)
- [SuperAgent](https://github.com/visionmedia/superagent)
- [Stripe](https://stripe.com/)
- [Quill](http://quilljs.com/)

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
    { linkText: 'Make a donation', url: '/donate' },
    // Add more here (BUT UNLIKE THE ADMIN ROUTES, MAKE SURE YOU ADD TO routes.js as well)
  ],
  validResources: [
    'users',
    'books',
    'permissions',
    'roles',
    'pages'
  ],
  resourcesWithEditor: [ // Specify resources that you would like to use the inline editor for rather than a form.
    'page'
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

## Screenshots of Current State of the App (09/01/2016)

### Default Edit Page

![updateuser](https://cloud.githubusercontent.com/assets/3317231/18188929/f211ae94-706a-11e6-96e6-965cbd448d59.JPG)

### Edit Page with inline content editor:

![image resize 2](https://cloud.githubusercontent.com/assets/3317231/18188875/83a42932-706a-11e6-9257-3da0cbdd4d2a.JPG)


### Admin interface

Example Index Page

![userindex](https://cloud.githubusercontent.com/assets/3317231/18188874/83a15590-706a-11e6-8b94-2421abb8cd3c.JPG)

Example Admin Page with open SpeedDial menu

![roleindexwspeeddial](https://cloud.githubusercontent.com/assets/3317231/18188873/839b2a30-706a-11e6-9760-b2bf0ad29b07.JPG)

Example Admin page with open Drawer

![menuopen](https://cloud.githubusercontent.com/assets/3317231/18188872/8392df88-706a-11e6-84eb-7863e1293b1e.JPG)

### Admin Login Page

Login Page with Drawer showing frontent paths available

![login](https://cloud.githubusercontent.com/assets/3317231/18188871/837df6a4-706a-11e6-9008-df6bf144c9aa.JPG)

Donation Page Content (implemented with Stripe)

![donationpagecontent](https://cloud.githubusercontent.com/assets/3317231/18188998/994dd7dc-706b-11e6-9f77-fc4e8bed10fa.JPG)

### WIP

- [ ] Route permissions are still a WIP and will utilize roles
- [ ] Inline Editor with image manipulation functionality.
- [ ] Form Validation using Redux
- [ ] Allow Page nesting in Index
- [ ] Add Searching and Reordering of resources
- [ ] Add Media / File Management
- [ ] Webworkers for Caching data
- [ ] Add Tests using Jest

