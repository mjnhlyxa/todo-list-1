const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let sockets = {};

io.on('connect', (socket) => {
  const id = Math.random();
  sockets[id] = socket;
  socket.on('saveTasks', (tasks) => {
    Object.keys(sockets).forEach((id) => sockets[id].emit('refresh', tasks));
  });
  socket.on('disconnect', () => delete sockets[id]);
});

nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
