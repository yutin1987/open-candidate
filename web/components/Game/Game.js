import _ from 'lodash';
import React from 'react';
import Phaser from 'phaser';
import window from 'global/window';
import io from 'socket.io-client';
import styled from 'styled-components';

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
        me.setTexture('atlas', 'misa-left');
      } else if (direction === 'up') {
        me.setTexture('atlas', 'misa-back');
      } else if (direction === 'right') {
        me.setTexture('atlas', 'misa-right');
      } else if (direction === 'down') {
        me.setTexture('atlas', 'misa-front');
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
}

function create() {
  scene = this;

  const map = this.make.tilemap({ key: 'map' });

  const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

  const belowLayer = map.createStaticLayer('Below Player', tileset, 0, 0);
  const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
  const aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  aboveLayer.setDepth(10);

  const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');

  me = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'misa-front');
  me.setSize(30, 40);
  me.setOffset(0, 24);
  me.setDepth(5);

  socket.emit('rename', { nickname: 'new me', x: me.x, y: me.y });

  this.physics.add.collider(me, worldLayer);

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
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();

  this.add
    .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
      font: '18px monospace',
      fill: '#000000',
      padding: { x: 20, y: 10 },
      backgroundColor: '#ffffff',
    })
    .setScrollFactor(0)
    .setDepth(30);

  this.input.keyboard.once('keydown_D', (event) => {
    this.physics.world.createDebugGraphic();
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    worldLayer.renderDebug(graphics, {
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
  componentDidMount() {
    this.game = new Phaser.Game(config);
    window.addEventListener('resize', () => {
      if (this.game) {
        this.game.resize(window.innerWidth, window.innerHeight);
      }
    });
  }

  render() {
    return (<Container id="game" />);
  }
}
