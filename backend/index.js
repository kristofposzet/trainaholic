const express = require('express'),
  cookieParser = require('cookie-parser'),
  { Server } = require('socket.io'),
  http = require('http'),
  path = require('path'),
  apiRoutes = require('./routes'),
  socketHandler = require('./socketUtils/socketHandler');

const app = express();

app.use(cookieParser());
// beepitett middleware, jelezzuk, h a keresek objektumai JSON formatumuak
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const server = http.createServer(app);

const io = new Server(server);
socketHandler.handleSockets(io);

server.listen(process.env.PORT || 5000);
console.log(`Server listening on port: ${process.env.PORT || 5000}`);

module.exports = app;
