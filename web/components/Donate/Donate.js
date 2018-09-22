import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import Dialogue from '../Dialogue/Dialogue';
import Material from '../Material/Material';

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

const Materials = styled.div`
  display: grid;
  grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
`;

const Label = styled.label`
  margin: 30px 0;
  display: block;
  background: #FFF;
  padding: 10px 13px;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  width: fit-content;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  width: calc(100% - 60px);
`;

const Form = styled.div`
  margin: 0 30px;
`;

const materials = [
  { name: 'bus', nickname: '公車', price: 10000 },
  { name: 'trash', nickname: '垃圾車', price: 8000 },
  { name: 'power', nickname: '變電箱', price: 5000 },
  { name: 'light', nickname: '路燈', price: 3000 },
  { name: 'ubike', nickname: 'UBike', price: 2000 },
  { name: 'busstop', nickname: '站牌', price: 1000 },
  { name: 'ladder', nickname: '梯子', price: 800 },
  { name: 'wood', nickname: '木板', price: 500 },
  { name: 'tree', nickname: '樹', price: 300 },
  { name: 'flowers', nickname: '花叢', price: 200 },
  { name: 'flower', nickname: '花', price: 100 },
];

export default class extends React.Component {
  state = {
    price: null,
    nickname: '',
    message: '',
    step: 0,
  };

  onClick = price => this.setState({ price });

  onSubmit = () => {
    const { onSubmit } = this.props;
    const { price, nickname, message, step } = this.state;

    if (step === 1) {
      onSubmit({ price, nickname, message });
      return;
    }

    if (price) this.setState({ step: 1 });
  }

  onChange = (event, name) => {
    this.setState({ [name]: event.target.value });
  }

  renderContent() {
    const { onCancel } = this.props;
    const { price, nickname, message, step } = this.state;
    if (step === 1) {
      return (
        <React.Fragment>
          <Form>
            <Label htmlFor="nickname">請輸入，物資上顯示的名稱</Label>
            <Input id="nickname" placeholder="匿名" value={nickname} onChange={e => this.onChange(e, 'nickname')} />
            <Label htmlFor="message">請送給城市一句話</Label>
            <Input id="message" placeholder="none" value={message} onChange={e => this.onChange(e, 'message')} />
          </Form>
          <Cancel onClick={onCancel}>
            取消，回上一步
          </Cancel>
          <Submit onClick={this.onSubmit}>
            好，立即購買
          </Submit>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Materials>
          {_.map(materials, material => (
            <Material
              key={material.name}
              {...material}
              selected={material.price === price}
              onClick={this.onClick}
            />
          ))}
        </Materials>
        <Cancel onClick={onCancel}>
          取消，回上一步
        </Cancel>
        <Submit onClick={this.onSubmit}>
          好，選好物資了
        </Submit>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Dialogue {...this.props} messages={['請選擇你要購買的物資']}>
        {this.renderContent()}
      </Dialogue>
    );
  }
}
