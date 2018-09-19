import React from 'react';
import dynamic from 'next/dynamic';

const Game = dynamic(import('../components/Game/Game'));

export default class extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Game />
      </React.Fragment>
    );
  }
}
