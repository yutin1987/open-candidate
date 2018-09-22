import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
  background: url('/static/background.png');
  background-size: cover;
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Message = styled.div`
  position: absolute;
  background: #D7D7D7;
  border: 5px solid #E3B033;
  margin: 10vh;
  width: calc(100% - 20vh);
  padding: 20px;
  bottom: 0px;

  &:before {
    content: '';
    background: url('/static/assist/avatar.png');
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    height: 300px;
    width: 300px;
    left: 0px;
    top: -305px;
  }

  &:after {
    content: '';
    background: url('/static/assist/next.png');
    background-size: 30px;
    background-repeat: no-repeat;
    position: absolute;
    height: 30px;
    width: 30px;
    right: 18px;
    bottom: 18px;
  }

  p {
    line-height: 36px;
  }
`;

export default class extends React.Component {
  render() {
    return (
      <Background>
        <Message>
          <p>你好，我是曾柏瑜！</p>
          <p>目前是新北市第8選區市議員候選人，28歲，已婚，育有3隻毛小孩。</p>
          <p>這裡是我所居住的城市，更精確地來說，是「我們」將要一起創造的城市。</p>
          <p>如果你想知道自己能幫上什麼忙的話，歡迎到處走走看看哦！</p>
        </Message>
      </Background>
    );
  }
}
