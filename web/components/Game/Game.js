import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import EasyStar from 'easystarjs';
import window from 'global/window';
import document from 'global/document';
import io from 'socket.io-client';
import styled from 'styled-components';
import NPC from '../NPC/NPC';
import Donate from '../Donate/Donate';
import messages from './messages';

const { Phaser } = window;

const Container = styled.div`
  margin: 0;
  padding: 0;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const socket = io();
const players = new Map();

let me;
let cursors;
let scene;

const npcs = {};
const materials = {};

socket.on('rename', ({ id, nickname, x, y } = {}) => {
  if (scene && !players.has(id)) {
    const player = scene.add.sprite(x, y, 'atlas', 'misa-front');
    player.nickname = nickname;
    players.set(id, player);
  }
});
socket.on('leave', ({ id }) => {
  const player = players.get(id);
  if (player) {
    player.destroy();
    players.delete(id);
  }
});
socket.on('move', ({ id, x, y }) => {
  const player = players.get(id);
  if (player) {
    const distance = Phaser.Math.Distance.Between(player.x, player.y, x, y);
    const angle = Phaser.Math.Angle.Between(player.x, player.y, x, y) + 3;
    const tween = player.scene.tweens.add({
      targets: player, x, y, duration: distance * 10,
    });

    let direction;
    if (angle <= 0.75 || angle > 5.25) {
      player.anims.play('misa-left-walk', true);
      direction = 'left';
    } else if (angle <= 2.25) {
      direction = 'up';
      player.anims.play('misa-back-walk', true);
    } else if (angle <= 3.75) {
      direction = 'right';
      player.anims.play('misa-right-walk', true);
    } else if (angle <= 5.25) {
      direction = 'down';
      player.anims.play('misa-front-walk', true);
    }

    tween.setCallback('onComplete', () => {
      player.anims.stop();
      if (direction === 'left') {
        player.setTexture('atlas', 'misa-left');
      } else if (direction === 'up') {
        player.setTexture('atlas', 'misa-back');
      } else if (direction === 'right') {
        player.setTexture('atlas', 'misa-right');
      } else if (direction === 'down') {
        player.setTexture('atlas', 'misa-front');
      }
    }, []);
  }
});

const move = _.debounce((key, position) => {
  socket.emit('move', { key, ...position });
}, 100, { maxWait: 500 });

function preload() {
  this.load.image('tiles', '/static/tilesets/tuxmon-sample-32px-extruded.png');
  this.load.tilemapTiledJSON('map', '/static/tilemaps/tuxemon-town.json');
  this.load.atlas('atlas', '/static/atlas/atlas.png', '/static/atlas/atlas.json');
  this.load.atlas('fi', '/static/character/fi/fi.png', '/static/character/fi/fi.json');

  this.load.atlas('huang', '/static/character/huang/huang.png', '/static/character/huang/huang.json');
  this.load.atlas('alex', '/static/character/alex/alex.png', '/static/character/alex/alex.json');
  this.load.atlas('bob', '/static/character/bob/bob.png', '/static/character/bob/bob.json');
  this.load.atlas('clara', '/static/character/clara/clara.png', '/static/character/clara/clara.json');
  this.load.atlas('dora', '/static/character/dora/dora.png', '/static/character/dora/dora.json');

  this.load.atlas('bus', '/static/material/bus/bus.png', '/static/material/bus/bus.json');
  this.load.atlas('busstop', '/static/material/busstop/busstop.png', '/static/material/busstop/busstop.json');
  this.load.atlas('ladder', '/static/material/ladder/ladder.png', '/static/material/ladder/ladder.json');
  this.load.atlas('light', '/static/material/light/light.png', '/static/material/light/light.json');
  this.load.atlas('power', '/static/material/power/power.png', '/static/material/power/power.json');
  this.load.atlas('trash', '/static/material/trash/trash.png', '/static/material/trash/trash.json');
  this.load.atlas('ubike', '/static/material/ubike/ubike.png', '/static/material/ubike/ubike.json');
  this.load.atlas('wood', '/static/material/wood/wood.png', '/static/material/wood/wood.json');
}

function create() {
  scene = this;

  this.map = this.make.tilemap({ key: 'map' });
  this.tileset = this.map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');
  this.belowLayer = this.map.createStaticLayer('Below Player', this.tileset, 0, 0);
  this.worldLayer = this.map.createStaticLayer('World', this.tileset, 0, 0);
  this.aboveLayer = this.map.createStaticLayer('Above Player', this.tileset, 0, 0);

  this.worldLayer.setCollisionByProperty({ collides: true });

  this.aboveLayer.setDepth(10);

  const start = this.map.findObject('Objects', obj => obj.name === 'start');

  me = this.physics.add.sprite(start.x, start.y, 'atlas', 'misa-front');
  me.setSize(30, 40);
  me.setOffset(0, 24);
  me.setDepth(5);
  // me.setCollideWorldBounds(true);

  socket.emit('rename', { nickname: 'new me', x: me.x, y: me.y });

  this.physics.add.collider(me, this.worldLayer);

  this.finder = new EasyStar.js(); // eslint-disable-line
  const grid = [];
  for (let y = 0; y < this.map.height; y += 1) {
    const col = [];
    for (let x = 0; x < this.map.width; x += 1) {
      col.push(this.worldLayer.getTileAt(x, y) ? 1 : 0);
    }
    grid.push(col);
  }
  this.finder.setGrid(grid);
  this.finder.setAcceptableTiles([0]);

  const npc = this.add.group();
  _.forEach([
    'fi', 'history', 'environment', 'transportation', 'nursery',
    'care', 'education', 'labor', 'residential', 'open', 'gender',
  ], (name) => {
    const point = this.map.findObject('Objects', obj => obj.name === name);
    npcs[name] = this.physics.add.sprite(point.x, point.y, 'atlas', 'misa-front');
    npcs[name].setSize(30, 40);
    npcs[name].setOffset(0, 24);
    npcs[name].setDepth(3);
    npcs[name].nickname = name;
    // npcs[name].body.immovable = true;
    this.physics.add.collider(npcs[name], this.worldLayer);
    npc.add(npcs[name]);
    npcs[name].goBack = _.debounce(() => {
      this.finder.findPath(
        Math.floor(npcs[name].x / 32),
        Math.floor(npcs[name].y / 32),
        Math.floor(point.x / 32),
        Math.floor(point.y / 32),
        (paths) => {
          if (paths === null) {
            console.warn('Path was not found.');
            return;
          }
          npcs[name].move(paths);
        },
      );
      this.finder.calculate();
    }, 500);

    npcs[name].move = (paths) => {
      const tweens = [];
      for (let i = 0; i < paths.length - 1; i += 1) {
        const ex = paths[i + 1].x;
        const ey = paths[i + 1].y;
        tweens.push({
          targets: npcs[name],
          x: { value: ex * 32, duration: 175 },
          y: { value: ey * 32, duration: 175 },
        });
      }
      this.tweens.timeline({ tweens });
    };
  });

  this.physics.add.collider(me, npc, (__, target) => {
    target.goBack();
    target.setVelocity(0);
  });

  const material = this.add.group();
  for (let i = 0; i < 100; i += 1) {
    const name = _.sample([
      'bus', 'busstop', 'ladder', 'light',
      'power', 'trash', 'ubike', 'wood',
    ]);
    materials[i] = this.physics.add.sprite(
      _.random(0, this.map.widthInPixels),
      _.random(0, this.map.heightInPixels),
      name,
      `${name}-front`,
    );
    materials[i].setFriction([1, 1]);
    material.add(materials[i]);
  }
  this.physics.add.collider(this.worldLayer, material);

  this.physics.add.collider(me, material, (__, target) => {
    target.body.stop();
  });

  window.me = me;
  window.Phaser = Phaser;

  const { anims } = this;
  _.map([
    'misa-left-walk',
    'misa-right-walk',
    'misa-front-walk',
    'misa-back-walk',
  ], (key) => {
    anims.create({
      key,
      frames: anims.generateFrameNames('atlas', {
        prefix: `${key}.`, start: 0, end: 3, zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  });

  const camera = this.cameras.main;
  camera.startFollow(me);
  camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();

  // this.add
  //   .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
  //     font: '18px monospace',
  //     fill: '#000000',
  //     padding: { x: 20, y: 10 },
  //     backgroundColor: '#ffffff',
  //   })
  //   .setScrollFactor(0)
  //   .setDepth(30);

  this.input.keyboard.once('keydown_D', () => {
    this.physics.world.createDebugGraphic();
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    this.worldLayer.renderDebug(graphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
  });

  socket.emit('update');
}

function update(time, delta) {
  const speed = 175;
  const prevVelocity = me.body.velocity.clone();

  // Stop any previous movement from the last frame
  me.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    me.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    me.body.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    me.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    me.body.setVelocityY(speed);
  }

  me.body.velocity.normalize().scale(speed);

  const position = _.pick(me, ['x', 'y']);
  if (cursors.left.isDown) {
    me.anims.play('misa-left-walk', true);
    move('left-walk', position);
  } else if (cursors.right.isDown) {
    me.anims.play('misa-right-walk', true);
    move('right-walk', position);
  } else if (cursors.up.isDown) {
    me.anims.play('misa-back-walk', true);
    move('back-walk', position);
  } else if (cursors.down.isDown) {
    me.anims.play('misa-front-walk', true);
    move('front-walk', position);
  } else {
    me.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) {
      me.setTexture('atlas', 'misa-left');
      move('left', position);
    } else if (prevVelocity.x > 0) {
      me.setTexture('atlas', 'misa-right');
      move('right', position);
    } else if (prevVelocity.y < 0) {
      me.setTexture('atlas', 'misa-back');
      move('back', position);
    } else if (prevVelocity.y > 0) {
      me.setTexture('atlas', 'misa-front');
      move('front', position);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } },
  },
  scene: { preload, create, update },
};

export default class extends React.Component {
  state = {
    dialogue: null,
  }

  componentDidMount() {
    this.game = new Phaser.Game(config);
    window.addEventListener('resize', () => {
      if (this.game) this.game.resize(window.innerWidth, window.innerHeight);
    });
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyUp = (event) => {
    if (event.code !== 'Space') return;

    const { dialogue } = this.state;
    if (dialogue) return;

    const { x, y } = me;
    const npc = _.find(npcs, (target) => {
      const distance = Phaser.Math.Distance.Between(target.x, target.y, x, y);
      if (distance < 70) return true;
      return false;
    });

    if (!npc) return;

    this.setState({ dialogue: npc.nickname });
  }

  onCancel = () => {
    this.setState({ dialogue: null, isDonate: false });
  }

  onSubmit = () => this.setState({ isDonate: true });

  onDonate = async ({ price, nickname, message }) => {
    const { dialogue } = this.state;
    const reply = await axios.post('/order', { type: dialogue, price, nickname, message });
    const { data } = reply;

    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', data.host);

    _.forEach({
      MerchantID: data.merchantId,
      RespondType: 'JSON',
      CheckValue: data.checkValue,
      MerchantOrderNo: data.merchantOrderNo,
      TimeStamp: data.timeStamp,
      Version: data.version,
      Amt: data.amount,
      ItemDesc: data.amount,
      NotifyURL: `https://${window.location.host}/notify`,
      ReturnURL: `https://${window.location.host}/`,
      LoginType: 0,
      CREDIT: 1,
      WEBATM: 1,
      VACC: 1,
      CVS: 1,
      BARCODE: 1,
      TradeLimit: 10 * 60,
    }, (value, key) => {
      const field = document.createElement('input');
      field.setAttribute('type', 'hidden');
      field.setAttribute('name', key);
      field.setAttribute('value', value);
      form.appendChild(field);
    });
    document.body.appendChild(form);
    form.submit();
  }

  renderDialogue() {
    const { dialogue, isDonate } = this.state;
    if (!dialogue) return null;

    const message = messages[dialogue];

    if (isDonate) {
      return (
        <Donate
          {...message}
          onCancel={this.onCancel}
          onSubmit={this.onDonate}
        />
      );
    }

    return (
      <NPC
        {...message}
        onCancel={this.onCancel}
        onSubmit={this.onSubmit}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container id="game" />
        {this.renderDialogue()}
      </React.Fragment>
    );
  }
}
