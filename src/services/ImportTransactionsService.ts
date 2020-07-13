import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    return [];
  }
}

export default ImportTransactionsService;
