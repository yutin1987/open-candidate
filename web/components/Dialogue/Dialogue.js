import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';

const Dialogue = styled.div`
  border: 5px solid #E3B033;
  background: #424242;
  position: absolute;
  top: 100px;
  left: 50px;
  width: calc(100% - 100px);
  height: calc(100vh - 150px);
  opacity: 0.9;
  padding: 30px 0;
  box-sizing: border-box;

  &:after {
    content: '';
    background: url('/static/assist/npc_icon.png');
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    height: 100px;
    width: 100px;
    left: 30px;
    top: -65px;
  }
`;

const Title = styled.div`
  color: #FFFFFF;
  border: 5px solid #E3B033;
  background: #303030;
  position: absolute;
  left: 100px;
  top: -40px;
  height: 40px;
  padding: 7px 20px 0px 20px;
  box-sizing: border-box;
`;

const Message = styled.div`
  margin: 30px 30px;
  background: #FFF;
  padding: 10px 13px;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  width: fit-content;
`;

export default class extends React.Component {
  render() {
    const { title, messages, children } = this.props;
    return (
      <Dialogue>
        <Title>{title}</Title>
        {_.map(messages, message => (
          <Message key={message}>{message}</Message>
        ))}
        {children}
      </Dialogue>
    );
  }
}
