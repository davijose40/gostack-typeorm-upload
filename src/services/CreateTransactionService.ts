// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // check if category exists
    const categoryRepository = getRepository(Category);
    const checkCategoryExistis = await categoryRepository.findOne({
      where: { title: category },
    });

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();
      if (total - value < 0) {
        throw new AppError(
          "You don't have enought funds to execute this outcome transaction. get a job man....!",
          400,
        );
      }
    }

    if (!checkCategoryExistis) {
      const titleCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(titleCategory);
    }

    const categoryRecord = await categoryRepository.findOne({
      where: { title: category },
    });

    const category_id = categoryRecord?.id;
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
