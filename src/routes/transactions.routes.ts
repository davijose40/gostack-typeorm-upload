import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request: Request, response: Response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();
  const transactionsAndBalance = {
    transactions,
    balance,
  };
  return response.json(transactionsAndBalance);
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category_id } = request.body;
  const createTransactionServide = new CreateTransactionService();
  const transaction = await createTransactionServide.execute({
    title,
    value,
    type,
    category_id,
  });

  return response.json(transaction);
});

transactionsRouter.delete(
  '/:id',
  async (request: Request, response: Response) => {
    // TODO
  },
);

transactionsRouter.post(
  '/import',
  async (request: Request, response: Response) => {
    // TODO
  },
);

export default transactionsRouter;
