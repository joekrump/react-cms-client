process.env.NODE_ENV = 'production';

var path = require('path');
var rimrafSync = require('rimraf').sync;
var webpack = require('webpack');
var config = require('../config/webpack.config.server');
var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relative = isInNodeModules ? '../..' : '.';
rimrafSync(relative + '/server_build');

var options = [
  config
]

webpack(options).run(function(err, stats) {
  if (err) {
    console.error('Failed to create a server build. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  console.log('Run Server with: npm run server');
});