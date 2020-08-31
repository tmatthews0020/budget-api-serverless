"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.list = exports.create = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid = __importStar(require("uuid"));
const auth_1 = require("./auth");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const TRANSACTION_TABLE_NAME = "transactions";
exports.create = async (event) => {
    const data = event.body;
    console.log(auth_1.getCognitoUserId(event));
    data.id = uuid.v1();
    data.userId = auth_1.getCognitoUserId(event);
    const params = {
        TableName: TRANSACTION_TABLE_NAME,
        Item: data,
    };
    await dynamoDb.put(params).promise();
    return "Created";
};
exports.list = async (event) => {
    const userId = auth_1.getCognitoUserId(event);
    console.log(userId);
    const params = {
        TableName: TRANSACTION_TABLE_NAME,
        FilterExpression: "#userId = :userId",
        ExpressionAttributeNames: {
            "#userId": "userId",
        },
        ExpressionAttributeValues: {
            ":userId": { S: userId },
        },
    };
    const resp = await dynamoDb.scan(params).promise();
    console.log(resp);
    return resp.Items ? resp.Items : [];
};
exports.get = async (event) => {
    const params = {
        TableName: TRANSACTION_TABLE_NAME,
        Key: {
            id: event.pathParameters.id,
            userId: auth_1.getCognitoUserId(event),
        },
    };
    const resp = await dynamoDb.get(params).promise();
    return resp.Item;
};
//# sourceMappingURL=handler.js.map