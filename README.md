**l-api-v2** is a SPA frontend interface for an API using JWT for authentication and implements the following: 
- [ReactJS](https://facebook.github.io/react/)
- [React Router](https://github.com/reactjs/react-router)
- [Redux](http://redux.js.org)
- [React Redux](https://github.com/reactjs/react-redux)
- [Redux Saga](https://github.com/yelouafi/redux-saga)
- [react-router-redux](https://github.com/reactjs/react-router-redux)
- [Material UI](http://www.material-ui.com/)
- [SuperAgent](https://github.com/visionmedia/superagent)
- [Stripe](https://stripe.com)
- [ContentTools](http://getcontenttools.com)

The dev environment for the app was created using [react-create-app](https://github.com/facebookincubator/create-react-app), an excellent tool for generating a skeleton React app with all the basic configuration taken care of. Visit the url above for more details. Redux Devtools are also used in dev environment.

CRUD admin interface is setup to be generic. 

## Setup Instructions

### Install node modules
```bash
$ npm install
```

### Create app_config directory
```bash
$ mkdir app_config
```

### Cloudinary Setup

To set up Cloudinary so that image uploading works in the content editor, follow the guide [here](http://getcontenttools.com/tutorials/image-uploads-with-cloudinary) to set and get the CLOUDINARY_PRESET_NAME, CLOUDINARY_RETRIEVE_URL and CLOUDINARY_UPLOAD_URL values.

### Create config files: `app.js` and `stripe.js`

- `app.js`:
```javascript
const app_config = {
  baseUrl: 'THE PATH OF THE CLIENT: ex. http://localhost:3000', // Note: If you are unsure what this is, try running `npm start` to see.
  apiBaseUrl: 'THE PATH TO YOUR API SERVER (followed by a trailing slash "/"): ex. http://localhost:8000/api/',
  adminRouteLinks: {
    dashboard: { linkText: 'Dashboard', url: '/admin' },
    pages: { linkText: 'Pages', url: '/admin/pages' },
    cards: { linkText: 'Cards', url: '/admin/cards' },
    roles: { linkText: 'Roles', url: '/admin/roles' },
    books: { linkText: 'Books', url: '/admin/books' },
    users: { linkText: 'Users', url: '/admin/users' },
    permission: { linkText: 'Permissions', url: '/admin/permissions' },
  },
  publicRouteLinks: [
    { linkText: 'Log In', url: '/login' },
    { linkText: 'Home', url: '/' },
    { linkText: 'About', url: '/about' },
    { linkText: 'Make a donation', url: '/donate' }
  ],
  validResources: [
    'users',
    'books',
    'permissions',
    'roles',
    'pages',
    'cards'
  ],
  resourcesWithEditor: [ // Specify resources that you would like to use the inline editor for rather than a form.
    'page',
    'card'
  ],
  CLOUDINARY_PRESET_NAME: 'PRESET NAME',
  CLOUDINARY_RETRIEVE_URL: 'ex. https://res.cloudinary.com/mycloud/image/upload',
  CLOUDINARY_UPLOAD_URL: 'ex. https://api.cloudinary.com/v1_1/mycloud/image/upload'
};

module.exports = app_config;
```

**NOTE** This app currently requires [Stripe](https://stripe.com/) for payments to be set up.

- `stripe.js`:
```javascript
var stripe_config = {
  test: {
    pk: 'YOUR STRIPE TEST PUBLIC KEY'
  }
};

module.exports = stripe_config; 
```

### Start Client App

```bash
$ npm start
```

## Screenshots of Current State of the App (11/01/2016)

### Edit Page with inline content editor:

![screenshot 26](https://cloud.githubusercontent.com/assets/3317231/19921089/9515d7b0-a099-11e6-844c-2cea95409b1e.png)
[View More Screenshots](https://github.com/joekrump/l-api-v2/wiki/Pages)

### Admin interface

Example Index Page

![screenshot 15](https://cloud.githubusercontent.com/assets/3317231/19921266/60d87e2a-a09a-11e6-9de9-888450f749e3.png)
[View More Screenshots](https://github.com/joekrump/l-api-v2/wiki/Admin-Interface)

### Admin Login Page

![Login Page](https://cloud.githubusercontent.com/assets/3317231/19920832/44d71468-a098-11e6-9a0a-7408c6bf37d7.PNG)
[View More Screenshots](https://github.com/joekrump/l-api-v2/wiki/Authentication)

### Form Validation

![form-validation](https://cloud.githubusercontent.com/assets/3317231/19921003/19873f1c-a099-11e6-92a8-4ed1ce6ba7d3.PNG)
[View More Screenshots](https://github.com/joekrump/l-api-v2/wiki/Form-Validation)

### API Server

Currently I have an API server built using Laravel 5.2 which this client app interacts with. The API server is currently in a private repository, and I have plans to make it public by the end of November 2016. There are also plans to migrate the current server code over to Sails, so that both the client and the server will be written in JS. If you have any questions regarding server specifics, please give me a shout by email or on LinkedIn.

### WIP

- [ ] Add Searching and Reordering of resources
- [ ] File Management System
- [ ] Webworkers for Caching data
- [x] Role based permissions
- [x] Inline Editor with image upload and manipulation functionality.
- [x] Form Validation using Redux
- [x] Allow Page nesting in Index
- [x] Image Uploading and editing
- [x] Add Tests using Jest
- [x] Page Template Loading
 
