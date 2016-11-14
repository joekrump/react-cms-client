var path = require('path');
var webpack = require('webpack');
var fs = require('fs')
// var autoprefixer = require('autoprefixer');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relativePath = isInNodeModules ? '../../..' : '..';
var srcPath = path.resolve(__dirname, relativePath, 'src');
var nodeModulesPath = path.join(__dirname, '..', 'node_modules');
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'server_build');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

//console.log('Node Modules: '+ JSON.stringify(nodeModules));
module.exports =

{
    // The configuration for the server-side rendering
    name: 'server',
    target: 'node',
    // devtool: 'source-map',
    entry: ['babel-polyfill', 'babel-register', path.join(srcPath, 'server')],
    output: {
      path: buildPath,
      filename: 'server.js',
      publicPath: '/'
    },
    externals: nodeModules,
    resolve: {
      extensions: ['', '.js'],
    },
    resolveLoader: {
      root: nodeModulesPath,
      moduleTemplates: ['*-loader']
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: srcPath,
          loader: 'babel',
          query: require('./babel.prod')
        },
        {
          test: /\.css$/,
          include: srcPath,
          loaders: [
            'isomorphic-style',
            'css',
            'postcss'
          ]
        },
        {
          test: /\.json$/,
          loader: 'json'
        },
        {
          test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
          loader: 'file',
        },
        {
          test: /\.(mp4|webm)$/,
          loader: 'url?limit=10000'
        },
        {
          test: /\.scss$/,
          include: srcPath,
          loaders: [
            'isomorphic-style',
            'css',
            'sass',
            'postcss'
          ]
        }
      ]
    },
    plugins: [
      new webpack.optimize.DedupePlugin()
    ]
};