import React from 'react';
import dynamic from 'next/dynamic';
import document from 'global/document';
import window from 'global/window';
import Enter from '../components/Enter/Enter';

const Game = dynamic(import('../components/Game/Game'));

export default class extends React.Component {
  state = {
    step: 0,
  };

  componentDidMount() {
    document.addEventListener('keypress', () => {
      window.Pace.restart();
      this.setState({ step: 1 });
    }, { once: true });
  }

  renderContent = () => {
    const { step } = this.state;
    if (step === 1) return <Game />;
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
