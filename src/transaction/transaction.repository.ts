import { DynamoDB } from "aws-sdk";
import { config } from "../config/config";
import { Transaction } from "./transaction.interface";

const dynamoDb = new DynamoDB.DocumentClient({
  apiVersion: config.apiVersions.dynamodb,
});
const TRANSACTION_TABLE_NAME = "transactions";
export class TransactionRepository {
  async create(transaction: Transaction) {
    const params = {
      TableName: TRANSACTION_TABLE_NAME,
      Item: transaction,
    };

    await dynamoDb.put(params).promise();

    return transaction;
  }

  async list(userId: string) {
    const params = {
      TableName: TRANSACTION_TABLE_NAME,
      FilterExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };
    try {
      const resp = await dynamoDb.scan(params).promise();
      console.log(resp);
      return resp.Items ? resp.Items : [];
    } catch (err) {
      console.error(err);
      return;
    }
  }

  async get(userId: string, id: string) {
    const params = {
      TableName: TRANSACTION_TABLE_NAME,
      Key: {
        id,
        userId,
      },
    };

    const resp = await dynamoDb.get(params).promise();

    return resp.Item;
  }
}
