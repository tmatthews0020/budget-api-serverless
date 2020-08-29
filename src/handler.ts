"use strict";

import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { getCognitoUserId } from "./auth";

const dynamoDb = new DynamoDB.DocumentClient();
const TRANSACTION_TABLE_NAME = "transactions";

export const create = (event) => {
  const data = event.body;

  data.id = uuid.v1();
  data.userId = getCognitoUserId(event);

  const params = {
    TableName: TRANSACTION_TABLE_NAME,
    Item: data,
  };

  dynamoDb.put(params, (err, data) => {
    console.log(err);

    if (err) {
      return {
        statusCode: err.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Could not fetch transactions",
      };
    }

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: data,
    };
  });
};

export const list = (event) => {
  console.log(event);

  const params = {
    TableName: TRANSACTION_TABLE_NAME,
    FilterExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": { S: getCognitoUserId(event) },
    },
  };

  dynamoDb.scan(params, (err, result) => {
    console.info(result);

    if (err) {
      console.log(err);

      return {
        statusCode: err.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Could not fetch transactions",
      };
    }

    if (!result) {
      return {
        statusCode: 200,
        body: [],
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(result.Items),
      };
    }
  });
};

export const get = (event) => {
  const params = {
    TableName: TRANSACTION_TABLE_NAME,
    Key: {
      id: event.pathParameters.id,
      userId: getCognitoUserId(event),
    },
  };

  dynamoDb.get(params, (err, result) => {
    if (err) {
      console.error(err);

      return {
        statusCode: err.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Couldn't get transaction",
      };
    }

    console.log(result);

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  });
};
