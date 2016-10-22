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

## Cloudinary Setup

To set up Cloudinary so that image uploading works in the content editor, follow the guide at [here](http://getcontenttools.com/tutorials/image-uploads-with-cloudinary) to set and get the CLOUDINARY_PRESET_NAME, CLOUDINARY_RETRIEVE_URL and CLOUDINARY_UPLOAD_URL values

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

4. Start Client App
```bash
$ npm start
```

## Screenshots of Current State of the App (09/01/2016)
**Update: (Oct. 16, 2016) New screenshots and short video demo coming soon**
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

### API Server

Currently I have an API server built using Laravel 5.2 which this client app interacts with. The API server is currently in a private repository, and I have plans to make it public by the end of November 2016. There are also plans to migrate the current server code over to Sails, so that both the client and the server will be written in JS. If you have any questions regarding server specifics, please give me a shout by email or on LinkedIn.

### WIP

- [x] Role based permissions
- [x] Inline Editor with image manipulation functionality.
- [x] Form Validation using Redux
- [x] Allow Page nesting in Index
- [ ] Add Searching and Reordering of resources
- [ ] Media / File Management
- [ ] Webworkers for Caching data
- [x] Add Tests using Jest
- [x] Page Template Loading
 
