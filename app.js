/**
 * Module dependencies.
 */
var express = require('express');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

var index = function(req, res) {
    res.render('index', {
      title : "WebRtcServerProject"
    });
};
app.get('/', index);

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
/**
 * Socket.io event handling
 */
require('./app/socketHandler.js')(io);