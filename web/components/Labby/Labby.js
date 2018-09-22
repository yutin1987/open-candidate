import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
  background: url('/static/background.png');
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Profile = styled.div`
  width: 300px;
  height: 300px;
`;

export default class extends React.Component {
  render() {
    const { character } = this.props;
    const src = `/static/profile/character/profile_${character}.png`;
    return (
      <Background>
        <Profile>
          <img src={src} alt={character} />
        </Profile>
      </Background>
    );
  }
}
