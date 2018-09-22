import '@babel/polyfill';
import _ from 'lodash';
import express from 'express';
import next from 'next';
import moment from 'moment-timezone';
import uuid from 'uuid/v4';
import knex from 'knex';
import bodyParser from 'body-parser';
import { BigNumber } from 'bignumber.js';
import Spgateway from './model/Spgateway';
import config from '../knexfile';

const db = knex(config);
const uuidParser = /^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/;

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
  app.post('/order', bodyParser.json(), async (req, res) => {
    const body = _.get(req, ['body'], {});
    if (
      [10000, 8000, 5000, 3000, 2000, 1000, 800, 500, 300, 200, 100].indexOf(body.price) < 0
      || ['history', 'environment', 'transportation', 'nursery', 'care', 'education', 'labor', 'residential', 'open', 'gender'].indexOf(body.type) < 0
    ) {
      res.status(400);
      return;
    }

    const data = _.pick(body, ['type', 'price', 'nickname', 'message']);
    const orderId = await db('order').insert({ ...data, created_at: new Date() }, 'id');
    const orderNo = new BigNumber(_.replace(orderId, /-/gi, ''), 16);
    res.json(Spgateway.generateTemporaryCredentials(orderNo.toString(32), body.price));
  });

  app.post('/notify', bodyParser.urlencoded({ extended: false }), async (req, res) => {
    const reply = Spgateway.verifyCallback(req.body.JSONData);
    if (reply.status === true) {
      const orderNo = new BigNumber(reply.merchantOrderNo, 32);
      const id = uuidParser.exec(_.padStart(orderNo.toString(16), 32, 0));
      const orderId = `${id[1]}-${id[2]}-${id[3]}-${id[4]}-${id[5]}`;
      await db('order').where('id', orderId).update({ paid_at: new Date() });
    }
    res.status(200).end();
  });

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
