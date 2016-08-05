const app_config = {
  baseUrl: 'http://localapp:3000',
  apiBaseUrl: 'http://laravel-api:1337/api/',
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
  validResourcesRootPaths: [
    '/users/', '/users',
    '/books/', '/books'
  ]
};

module.exports = app_config;