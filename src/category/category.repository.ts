import { DynamoDB } from "aws-sdk";
import { config } from "../config/config";
import { Category } from "./category.interface";

const dynamoDb = new DynamoDB.DocumentClient({
  apiVersion: config.apiVersions.dynamodb,
});

const CATEGORIES_TABLE_NAME = "categories";

export class CategoryRepository {
  async create(category: Category) {
    const params = {
      TableName: CATEGORIES_TABLE_NAME,
      Item: category,
    };
    return dynamoDb.put(params).promise();
  }

  async list(userId: string) {
    const params = {
      TableName: CATEGORIES_TABLE_NAME,
      FilterExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    return result.Items ? result.Items : [];
  }
}
