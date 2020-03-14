'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const TRANSACTION_TABLE_NAME = "transactions";

module.exports.create = async (event) => {
  return new Promise((resolve, reject) => {
    const data = JSON.parse(event.body);

    data.id = uuid.v1();
  
    const params = {
      TableName: TRANSACTION_TABLE_NAME,
      Item: data,
    }
    dynamoDb.put(params, (err, data) => {
      if (err) {
        reject(err);
      }
  
      resolve(data);
    })
  })
};

module.exports.list =  async (event) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: TRANSACTION_TABLE_NAME
    }
  
    dynamoDb.scan(params, (err, result) => {
      if (err) {
        reject({
          statusCode: err.statusCode || 501,
          headers: { "Content-Type": "text/plain"},
          body: "Could not fetch transactions",
        })
      }

      if (!result) {
        resolve({
          statusCode: 200,
          body: [],
        })
      }
    
      resolve({
        statusCode: 200,
        body: JSON.stringify(result.Items),
      });
    })
  })
}

module.exports.get = async (event) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: TRANSACTION_TABLE_NAME,
      Key: {
        id: event.pathParameters.id,
      },
    }
  
    dynamoDb.get(params, (err, result) => {
      if (err) {
        console.error(err);
        
        reject({
          statusCode: err.statusCode || 501,
          headers: {'Content-Type': 'text/plain'},
          body: "Couldn't get transaction"
        })
      }

      console.log(result);
  
      resolve({
        statusCode: 200,
        body: JSON.stringify(result.Item),
      });
    })
  })
}

