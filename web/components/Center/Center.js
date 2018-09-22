import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Dialogue from '../Dialogue/Dialogue';

const types = {
  history: '文史',
  environment: '環境',
  transportation: '交通',
  nursery: '托育',
  care: '長照',
  education: '教育',
  labor: '勞動',
  residential: '住宅',
  open: '開放',
  gender: '性別',
};

const Cancel = styled.div`
  position: absolute;
  right: 30px;
  bottom: 30px;
  background: #867C70;
  padding: 16px 22px;
  border-radius: 13px;
  cursor: pointer;
`;

const Expense = styled.div`
  position: absolute;
  right: 30px;
  bottom: 30px;
  background: #BF7820;
  padding: 16px 22px;
  border-radius: 13px;
  cursor: pointer;
`;

const Income = styled(Expense)`
  right: 230px;
`;

export default class extends React.Component {
  state = {
    isExpense: false,
    isIncome: false,
    income: [],
  }

  async componentDidMount() {
    const reply = await axios.post('/income');
    this.setState({ income: _.toArray(reply.data) });
  }

  onExpense = () => this.setState({ isExpense: true });

  onIncome = () => this.setState({ isIncome: true });

  render() {
    const { onCancel } = this.props;
    const { isExpense, isIncome, income } = this.state;

    if (isIncome) {
      return (
        <Dialogue
          title="物資捐獻清單"
          messages={[
            '前項已累計捐獻 1,258,337',
            ..._.map(income, item => (
              `${new Date(item.created_at).toLocaleString()} ${item.nickname || '匿名'} 捐獻 ${item.price} 在 ${types[item.type]}`
            )),
          ]}
        >
          <Cancel onClick={onCancel}>
            關閉
          </Cancel>
        </Dialogue>
      );
    }

    if (isExpense) {
      return (
        <Dialogue
          title="城市支出清單"
          messages={[
            '人事費用支出 07月 68000 08月 73208 09月 65000 總計 206,208',
            '交通旅運支出 03月前 30000 總計 30,000',
            '宣傳支出 03月前 221960 04月 3167 05月 51754 06月 25902 07月 15280 08月 71669 09月 145243 總計 534,975',
            '集會支出 03月前 48325 06月 2625 09月 1750 總計 52,700',
            '雜支支出 05月 120 06月 2425 07月 835 08月 201392 09月 120 總計 204,892',
            '支出總計: 1,028,775',
          ]}
        >
          <Cancel onClick={onCancel}>
            關閉
          </Cancel>
        </Dialogue>
      );
    }

    return (
      <Dialogue
        title="後勤中心"
        messages={[
          '哈囉！歡迎光臨後勤中心！',
          '請問有什麼需要我幫忙嗎？',
        ]}
      >
        <Income onClick={this.onIncome}>
          物資捐獻清單
        </Income>
        <Expense onClick={this.onExpense}>
          城市支出清單
        </Expense>
      </Dialogue>
    );
  }
}
