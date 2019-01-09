const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dirs = require('./mocks/mock_dirs');
const dir = require('./mocks/mock_dir');

module.exports = {
  open: false,
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
    app.use(bodyParser.json());

    // get files
    app.all('/resources/api/directory/metadata', (req, res) => {
      const path = req.body.path;
      if (path === '/') res.json(dirs);
      else res.json(dir);
    });

    // create folder
    app.all('/resources/api/directory/create', (req, res) => {
      res.json({ code: 'OK' });
    });

    // copy
    app.all('/resources/api/resource/copy', (req, res) => {
      res.json({ code: 'OK' });
    });

    // move
    app.all('/resources/api/resource/move', (req, res) => {
      res.json({ code: 'OK' });
      console.log(req.body);
    });

    // delete
    app.all('/resources/api/resource/delete', (req, res) => {
      res.json({ code: 'OK' });
      console.log(req.body);
    });

    // upload
    app.all('/resources/api/resource/upload', (req, res) => {
      res.json({ code: 'OK' });
      console.log(req.body);
    });

    // archive
    app.all('/resources/api/resource/zip', (req, res) => {
      res.json({ code: 'OK' });
      console.log(req.body);
    });

    // get file
    app.use('/resources/upload/', (req, res) => {
      const ext = /[.]/.exec(req.originalUrl) ? /[^.]+$/.exec(req.originalUrl) : undefined;
      if (ext[0] === 'jpg') {
        res.sendfile('./mocks/sample.jpg');
      } else if (ext[0] === 'png') {
        res.sendfile('./mocks/sample.png');
      } else if (ext[0] === 'pdf') {
        res.sendfile('./mocks/sample.pdf');
      }
    });
  },
};
