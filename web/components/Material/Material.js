import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border: 2px solid #E3B033;
  margin: 40px auto;
  ${(({ selected }) => (selected && 'border-color: #5B8928'))}
`;

const Nickname = styled.div`
  position: absolute;
  left: -2px;
  top: -30px;
  text-align: center;
  padding: 6px;
  height: 30px;
  background: #E3B033;
  box-sizing: border-box;
  width: calc(100% + 4px);
  color: #FFF;
  border-radius: 10px 10px 0 0;
  ${(({ selected }) => (selected && 'background: #5B8928'))}
`;

const Price = styled.div`
  position: absolute;
  left: -2px;
  bottom: -30px;
  text-align: center;
  padding: 6px;
  height: 30px;
  background: #E3B033;
  box-sizing: border-box;
  width: calc(100% + 4px);
  color: #FFF;
  border-radius: 0 0 10px 10px;
  ${(({ selected }) => (selected && 'background: #5B8928'))}
`;

export default class extends React.Component {
  onClick = () => {
    const { price, onClick } = this.props;
    onClick(price);
  }

  render() {
    const { selected, name, nickname, price, onClick } = this.props;

    return (
      <Wrapper selected={selected} onClick={this.onClick}>
        <Nickname selected={selected}>{nickname}</Nickname>
        <img src={`/static/profile/material/profile_${name}.png`} alt={name} />
        <Price selected={selected}>{`NT$ ${price}`}</Price>
      </Wrapper>
    );
  }
}
