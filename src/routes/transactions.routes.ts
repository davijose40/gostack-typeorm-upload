import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import configMulter from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(configMulter);

transactionsRouter.get('/', async (request: Request, response: Response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();
  const transactionsAndBalance = {
    transactions,
    balance,
  };
  return response.json(transactionsAndBalance);
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category } = request.body;
  const createTransactionServide = new CreateTransactionService();
  const transaction = await createTransactionServide.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete(
  '/:id',
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const deleteTransactionService = new DeleteTransactionService();
    await deleteTransactionService.execute({ id });

    return response.status(204).json();
  },
);

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request: Request, response: Response) => {
    // const { file } = request;
    const file = request.file.path;
    const importTransactionsService = new ImportTransactionsService();
    const transactionsArray = await importTransactionsService.execute(file);

    return response.json(transactionsArray);
  },
);

export default transactionsRouter;
