const express = require('express');
// const http = require('http').Server(express);
// const socketio = require('socket.io')(http, { pingTimeout: 60000 });
const port = process.env.PORT || 5000;
// const port_socketid = 8083;

const app = express();

app.use(express.static(__dirname + "/dist/"));
app.get(/.*/ , function(req,res) {
  res.sendfile(__dirname + "/dist/index.html");
});

// socketio.on('connection', (socket) => {
//   // new socket connected

//   // listen for a 'message' event
//   socket.on('message', (eventData) => {
//     // attach the current time
//     eventData.processed = Date.now();
//     console.log(eventData)
//     // send the message back to the client
//     socket.emit('message', eventData);
//   })
// });

// http.listen(port_socketid, () => {
//   console.log('Server started on port', port_socketid);
// });

app.listen(port);

console.log("Server started..."); 