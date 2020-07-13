import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    // get all records in db return an array
    const transactions = await this.find();

    if (transactions.length < 0) {
      return balance;
    }

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, curr) => {
        return acc + curr.value;
      }, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((acc, curr) => {
        return acc + curr.value;
      }, 0);

    const total = income - outcome;

    balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
