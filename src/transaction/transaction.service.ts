import { Transaction } from "./transaction.interface";
import { TransactionRepository } from "./transaction.repository";

export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(transaction: Transaction) {
    return this.transactionRepository.create(transaction);
  }

  async list(userId: string) {
    return this.transactionRepository.list(userId);
  }

  async get(userId: string, id: string) {
    return this.transactionRepository.get(userId, id);
  }
}
