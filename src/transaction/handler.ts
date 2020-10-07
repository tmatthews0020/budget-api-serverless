"use strict";

import * as uuid from "uuid";
import { getCognitoUserId } from "../auth";
import { TransactionRepository } from "./transaction.repository";
import { TransactionService } from "./transaction.service";

class TransactionHandler {
  constructor(private transactionService: TransactionService) {}

  async create(event: any) {
    const data = event.body;

    data.id = uuid.v1();
    data.userId = getCognitoUserId(event);

    return this.transactionService.create(data);
  }

  async list(event: any) {
    const userId = getCognitoUserId(event);

    return this.transactionService.list(userId);
  }

  async get(event: any) {
    return this.transactionService.get(getCognitoUserId(event), event.path.id);
  }
}
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const transactionHandler = new TransactionHandler(transactionService);

export const create = transactionHandler.create.bind(transactionHandler);
export const list = transactionHandler.list.bind(transactionHandler);
export const get = transactionHandler.get.bind(transactionHandler);
