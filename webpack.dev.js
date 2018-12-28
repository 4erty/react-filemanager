'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const publicPath = '/';
const dirs = require('./mocks/mock_dir');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  output: {
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: true,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  // resolve: { extensions: ['*', '.js', '.jsx'] },
  optimization: {
    usedExports: true,
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    compress: true,
    watchContentBase: true,
    publicPath: '/',
    quiet: true,
    host: '0.0.0.0',
    overlay: false,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
    },
    port: 3000,
    hot: false,
    hotOnly: false,
    before: (app, server) => {
      app.get('/resources/api/directory/metadata', (req, res) => {
        res.json(dirs);
      });
      app.get('/resources/api/directory/create', (req, res) => {
        res.json({ code: 'OK' });
      });
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: __dirname + '/src/index.html',
      title: 'React Test Development',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
};
