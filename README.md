# React CMS Client

A CMS client interface built with React. It allows for interaction with an [API server](https://github.com/joekrump/react-cms-api-server) built using Laravel.

This project makes use of the following frameworks and technologies:
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

Currently I have an API server built using Laravel 5.2 which this client app interacts with. The API server code can be found on GitHub [here](https://github.com/joekrump/react-cms-api-server). There are plans to migrate the current server code over to Sails so that both the client and the server will be written in JS. If you have any questions regarding server specifics, please give me a shout by email or on LinkedIn.

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
  baseUrl: 'http://localhost:3000', // Note: If you are unsure what this is, try running `npm start` to see.
  apiBaseUrl: 'http://localhost:8000/api/', // Note: Should be the base route of your API with a trailing "/"
  routes: {
    public: [
      { label: 'Log In', url: '/login' },
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Make a donation', url: '/donate' }
    ],
    admin: {
      dashboard: { label: 'Dashboard', url: '/admin' },
      pages: { label: 'Pages', url: '/admin/pages' },
      cards: { label: 'Cards', url: '/admin/cards' },
      roles: { label: 'Roles', url: '/admin/roles' },
      books: { label: 'Books', url: '/admin/books' },
      users: { label: 'Users', url: '/admin/users' },
      permission: { label: 'Permissions', url: '/admin/permissions' },
    },
  },
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

### Start Client App in Development mode

```bash
$ npm start
```

### Build Client App for Productions with Server-side rendering

```bash
$ npm run build & npm run build-server
```

#### Launch Production Server

```bash
$ npm run server
```

### WIP

- [ ] Add backend search functionality
- [ ] File Management System
- [ ] Service Workers for caching data (PWA)
- [ ] Improve content editor
  - [ ] Inserting quotes
  - [ ] Text highlighting
- [x] Role based permissions
- [x] Inline Editor with image upload and manipulation functionality.
- [x] Form Validation using Redux
- [x] Allow Page nesting in Index
- [x] Image Uploading and editing
- [x] Add Tests using Jest
- [x] Page Template Loading
 
