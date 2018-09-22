import React from 'react';
import dynamic from 'next/dynamic';
import document from 'global/document';
import window from 'global/window';
import Enter from '../components/Enter/Enter';
import Labby from '../components/Labby/Labby';

const Game = dynamic(import('../components/Game/Game'));

const characters = ['alex', 'bob', 'clara', 'dora', 'huang'];

export default class extends React.Component {
  state = {
    step: 0,
    idx: 0,
  };

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
  }

  onKeyUp = (event) => {
    if (event.code === 'ArrowLeft') {
      const { idx } = this.state;
      this.setState({ idx: (idx - 1) < 0 ? characters.length - 1 : idx - 1 });
      return;
    }
    if (event.code === 'ArrowRight') {
      const { idx } = this.state;
      this.setState({ idx: (idx + 1) >= characters.length ? 0 : idx + 1 });
      return;
    }
    if (event.code !== 'Space') return;
    const { step } = this.state;
    window.Pace.restart();
    this.setState({ step: step + 1 });
    if (step + 1 >= 2) document.removeEventListener('keyup', this.onKeyUp);
  }

  renderContent = () => {
    const { step, idx } = this.state;
    if (step === 2) return <Game character={characters[idx]} />;
    if (step === 1) return <Labby character={characters[idx]} />;
    return <Enter />;
  }

  render() {
    return (
      <React.Fragment>
        {this.renderContent()}
      </React.Fragment>
    );
  }
}
