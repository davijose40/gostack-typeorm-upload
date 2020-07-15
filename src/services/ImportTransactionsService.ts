import csv from 'csvtojson';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(file: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    let transactionsArray: Transaction[] = [];

    // async / await
    const jsonArray = await csv().fromFile(file);

    const transArray = jsonArray.map(async t => {
      const { title, value, type, category } = t;
      const transaction = await createTransactionService.execute({
        title,
        value,
        type,
        category,
      });

      return transaction;
    });

    transactionsArray = await Promise.all(transArray);

    return transactionsArray;
  } // end of execute function
}
export default ImportTransactionsService;
