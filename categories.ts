'use strict'

import { DynamoDB } from 'aws-sdk';
import * as uuid from "uuid";
const dynamoDb = new DynamoDB.DocumentClient();
const TRANSACTION_TABLE_NAME = "categories";

export const create = (event) => {
  return new Promise((resolve, reject) => {
  
      const data = JSON.parse(event.body);
  
      data.id = uuid.v1();
      data.userId = event.requestContext.authorizer.principalId;
  
      const params = {
        TableName: TRANSACTION_TABLE_NAME,
        Item: data,
      };
  
      dynamoDb.put(params, (err, data) => {
        if (err) {
          reject({
            statusCode: err.statusCode || 501,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
             body: "Could not fetch transactions",
          });
        }
    
        resolve({
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: data
        });
      });
    });
  };
  
  export const list = (event) => {
    return new Promise((resolve, reject) => {
  
      console.log(event.requestContext.authorizer.principalId);
  
      const params = {
        TableName: TRANSACTION_TABLE_NAME,
        FilterExpression: "#userId = :userId",
        ExpressionAttributeNames: {
          "#userId": "userId"
        },
        ExpressionAttributeValues: {
          ":userId": { "S": event.requestContext.authorizer.principalId }
        } 
      };
    
      dynamoDb.scan(params, (err, result) => {
  
        console.info(result);
  
  
        if (err) {
          reject({
            statusCode: err.statusCode || 501,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
             body: "Could not fetch transactions",
          })
        }
  
        if (!result) {
          resolve({
            statusCode: 200,
            body: [],
          })
        }else {
          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(result.Items),
          });
        }
      })
    })
  }