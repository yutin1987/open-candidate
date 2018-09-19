import '@babel/polyfill';
import _ from 'lodash';
import express from 'express';
import next from 'next';
import moment from 'moment-timezone';
import uuid from 'uuid/v4';

const PORT = process.env.NODE_PORT || process.env.PORT || 8080;

moment.tz.setDefault('Asia/Taipei');

const dev = process.env.NODE_ENV !== 'production';
const web = next({ dev, dir: './web/', conf: { poweredByHeader: false } });
const handle = web.getRequestHandler();

const players = new Map();

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

web.prepare().then(() => {
  app.get('*', (req, res) => handle(req, res));
});

io.on('connection', (socket) => {
  const id = uuid();
  players.set(id, socket);
  socket.on('update', () => {
    players.forEach((player, key) => {
      if (key === id) return;
      socket.emit('rename', {
        id: key,
        ..._.pick(player, ['nickname', 'x', 'y']),
      });
    });
  });
  socket.on('rename', ({ nickname, x, y } = {}) => {
    const player = players.get(id);
    player.x = x;
    player.y = y;
    player.nickname = nickname;
    socket.broadcast.emit('rename', { id, nickname, x, y });
  });
  socket.on('move', ({ key, x, y } = {}) => {
    const player = players.get(id);
    player.x = x;
    player.y = y;
    socket.broadcast.emit('move', { id, key, x, y });
  });
  socket.on('disconnect', () => {
    players.delete(id);
    socket.broadcast.emit('leave', { id });
  });
  console.log(`user connected: ${id}`);
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});
