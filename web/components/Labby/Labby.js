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

const KeyButton = styled.div`
  border: 2px solid #B57A35;
  color: #B57A35;
  padding: 6px;
  margin-left: 10px;
  background: #D7D7D7;
`;

const Keyboard = styled.div`
  display: flex;
  position: absolute;
  right: 18px;
  bottom: 18px;
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
        <Keyboard>
          <KeyButton>← → | 選擇角色</KeyButton>
          <KeyButton>Space | 按空白鍵繼續</KeyButton>
        </Keyboard>
      </Background>
    );
  }
}
