"use strict";

import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { getCognitoUserId } from "./auth";
import { DYNAMODB_API_VERSION } from "./config/api-version";

const dynamoDb = new DynamoDB.DocumentClient({
  apiVersion: DYNAMODB_API_VERSION,
});
const CATEGORIES_TABLE_NAME = "categories";

export const create = (event) => {
  return new Promise((resolve, reject) => {
    const data = JSON.parse(event.body);

    data.userId = getCognitoUserId(event);
    data.id = uuid.v1();

    const params = {
      TableName: CATEGORIES_TABLE_NAME,
      Item: data,
    };

    dynamoDb
      .put(params, (err, data) => {
        if (err) {
          reject("Could not fetch transactions");
        }

        resolve(data);
      })
      .promise();
  });
};

export const list = (event) => {
  return new Promise((resolve, reject) => {
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

    dynamoDb.scan(params, (err, result) => {
      console.info(result);

      if (err) {
        reject("Could get categories");
      }

      if (!result) {
        resolve({
          statusCode: 200,
          body: [],
        });
      } else {
        resolve(result.Items);
      }
    });
  });
};
