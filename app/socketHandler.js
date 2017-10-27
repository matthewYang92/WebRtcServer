module.exports = function(io) {

  var mSockets = [];

  io.on('connection', function(client) {
    console.log('-- ' + client.id + ' joined --');
    mSockets.push(client);
    client.emit('id', client.id);

    client.on('init', function () {
        console.log('-- ' + client.id + ' init');
        for (var i = 0; i < mSockets.length; i++) {
          var otherClient = mSockets[i];
          if (client.id != otherClient.id) {
            otherClient.emit('message',  {
                type: "init",
                from: client.id
            });
          }
        }
    });

    client.on('message', function (details) {
      console.log('-- ' + client.id + ' message --' + JSON.stringify(details));
      var otherClient = io.sockets.connected[details.to];
      if (!otherClient) {
        return;
      }
      delete details.to;
      otherClient.emit('message', details);
    });


    function leave() {
      console.log('-- ' + client.id + ' left --');
      var index = 0;
      while (index < mSockets.length && mSockets[index].id != client.id) {
          index++;
      }
      mSockets.splice(index, 1);

    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};