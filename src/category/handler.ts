"use strict";

import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { getCognitoUserId } from "../auth";
import { config } from "../config/config";

const dynamoDb = new DynamoDB.DocumentClient({
  apiVersion: config.apiVersions.dynamodb,
});
const CATEGORIES_TABLE_NAME = "categories";

export const create = async (event) => {
  const data = event.body;

  data.userId = getCognitoUserId(event);
  data.id = uuid.v1();

  const params = {
    TableName: CATEGORIES_TABLE_NAME,
    Item: data,
  };
  await dynamoDb.put(params).promise();
};

export const list = async (event) => {
  const params = {
    TableName: CATEGORIES_TABLE_NAME,
    FilterExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": getCognitoUserId(event),
    },
  };

  const result = await dynamoDb.scan(params).promise();

  return result.Items ? result.Items : [];
};
