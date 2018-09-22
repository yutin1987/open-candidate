import React from 'react';
import styled from 'styled-components';
import Dialogue from '../Dialogue/Dialogue';

const Cancel = styled.div`
  position: absolute;
  right: 230px;
  bottom: 30px;
  background: #867C70;
  padding: 16px 22px;
  border-radius: 13px;
  cursor: pointer;
`;

const Submit = styled.div`
  position: absolute;
  right: 30px;
  bottom: 30px;
  background: #BF7820;
  padding: 16px 22px;
  border-radius: 13px;
  cursor: pointer;
`;

export default class extends React.Component {
  render() {
    const { onCancel, onSubmit } = this.props;

    return (
      <Dialogue {...this.props}>
        <Cancel onClick={onCancel}>
          否，謝謝
        </Cancel>
        <Submit onClick={onSubmit}>
          好，我要購買物資
        </Submit>
      </Dialogue>
    );
  }
}
