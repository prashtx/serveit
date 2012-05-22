var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.configure(function() {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
});

function sendFile(response, filename, type) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log(err.message);
      if (err.code === 'ENOENT') {
        response.send(404);
      } else {
        response.send(500);
      }
      return;
    }
    response.header('Content-Type', type);
    response.send(data);
  });
}

app.get(/(.*)/, function(req, response) {
  var path = req.params[0];
  var index = path.lastIndexOf('.');
  var format = '';
  if (index > -1) {
    format = path.substring(index);
  }

  var type;
  switch (format) {
  case '.html':
    type = 'text/html';
    break;
  case '.css':
    type = 'text/css';
    break;
  case '.js':
    type = 'application/javascript';
    break;
  case '.gif':
    type = 'image/gif';
    break;
  case '.png':
    type = 'image/png';
    break;
  default:
    type = 'text/html';
  }

  sendFile(response, path, type);
});

exports.start = function() {
  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Listening on ' + port);
  });
};
