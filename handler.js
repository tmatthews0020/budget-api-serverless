'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports.create = async (event) => {
  return new Promise((resolve, reject) => {
    const data = JSON.parse(event.body);

    data.id = uuid.v1();
  
    const params = {
      TableName: 'transactions',
      Item: data,
    }
    dynamoDb.put(params, (error, data) => {
      if (error) {
        reject(error);
      }
  
      resolve(data);
    })
  })
};
