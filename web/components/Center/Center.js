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

const Table = styled.table`
  width: 780px;
  max-width: 100%;
  margin: 0 auto;
  background: #FFF;

  & thead {
    border-bottom: 2px solid #000;
  }

  & tfoot {
    border-top: 0.5px solid #000;
  }

  & th,
  & td {
    text-align: right;
    padding: 10px;
  }

  & th:first-child,
  & td:first-child {
    text-align: left;
  }
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
          messages={['前項已累計捐獻 1,258,337']}
        >
          <Table>
            <thead>
              <tr>
                <th>日期</th>
                <th>議題</th>
                <th>居民</th>
                <th>金額</th>
              </tr>
            </thead>
            <tbody>
              {_.map(income, item => (
                <tr>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>{types[item.type]}</td>
                  <td>{item.nickname || '匿名'}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Cancel onClick={onCancel}>
            關閉
          </Cancel>
        </Dialogue>
      );
    }

    if (isExpense) {
      return (
        <Dialogue title="城市支出清單">
          <Table>
            <thead>
              <tr>
                <th>項目</th>
                <th>04月</th>
                <th>05月</th>
                <th>06月</th>
                <th>07月</th>
                <th>08月</th>
                <th>09月</th>
                <th>10月</th>
                <th>11月</th>
                <th>總計</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>人事費用支出</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>68,000</td>
                <td>83,970</td>
                <td>65,960</td>
                <td>75,762</td>
                <td>90,550</td>
                <td>384,242</td>
              </tr>
              <tr>
                <td>公共關係費用支出</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>11,994</td>
                <td>8,994</td>
                <td>20,988</td>
              </tr>
              <tr>
                <td>交通旅運支出</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>1,750</td>
                <td>0</td>
                <td>0</td>
                <td>1,750</td>
              </tr>
              <tr>
                <td>宣傳支出</td>
                <td>3,167</td>
                <td>51,754</td>
                <td>25,902</td>
                <td>15,280</td>
                <td>71,669</td>
                <td>363,904</td>
                <td>230,277</td>
                <td>551,115</td>
                <td>1,313,068</td>
              </tr>
              <tr>
                <td>集會支出</td>
                <td>0</td>
                <td>0</td>
                <td>2,625</td>
                <td>0</td>
                <td>0</td>
                <td>5,988</td>
                <td>67,448</td>
                <td>4,450</td>
                <td>80,511</td>
              </tr>
              <tr>
                <td>雜支支出</td>
                <td>0</td>
                <td>120</td>
                <td>2,425</td>
                <td>835</td>
                <td>201,392</td>
                <td>760</td>
                <td>490</td>
                <td>240</td>
                <td>206,262</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="9">支出總計</td>
                <td>2,006,821</td>
              </tr>
            </tfoot>
          </Table>
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
