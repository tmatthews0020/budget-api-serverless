"use strict";

import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { getCognitoUserId } from "./auth";
import { DYNAMODB_API_VERSION } from "./config/api-version";

const dynamoDb = new DynamoDB.DocumentClient({
  apiVersion: DYNAMODB_API_VERSION,
});
const TRANSACTION_TABLE_NAME = "transactions";

export const create = async (event) => {
  const data = event.body;

  console.log(getCognitoUserId(event));

  data.id = uuid.v1();
  data.userId = getCognitoUserId(event);

  const params = {
    TableName: TRANSACTION_TABLE_NAME,
    Item: data,
  };

  await dynamoDb.put(params).promise();

  return "Created";
};

export const list = async (event, context) => {
  console.log(`event ${JSON.stringify(event)}`);
  console.log(`context ${JSON.stringify(context)}`);

  const userId = getCognitoUserId(event);
  console.log(userId);

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
};

export const get = async (event) => {
  console.log(event);

  const params = {
    TableName: TRANSACTION_TABLE_NAME,
    Key: {
      id: event.path.id,
      userId: getCognitoUserId(event),
    },
  };

  const resp = await dynamoDb.get(params).promise();

  return resp.Item;
};
