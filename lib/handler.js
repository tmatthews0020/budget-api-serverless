'use strict';
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
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const TRANSACTION_TABLE_NAME = "transactions";
exports.create = (event) => {
    const data = JSON.parse(event.body);
    data.id = uuid.v1();
    data.userId = event.requestContext.authorizer.principalId;
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
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: "Could not fetch transactions",
            };
        }
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: data
        };
    });
};
exports.list = (event) => {
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
            console.log(err);
            return {
                statusCode: err.statusCode || 501,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: "Could not fetch transactions",
            };
        }
        if (!result) {
            return {
                statusCode: 200,
                body: [],
            };
        }
        else {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(result.Items),
            };
        }
    });
};
exports.get = (event) => {
    const params = {
        TableName: TRANSACTION_TABLE_NAME,
        Key: {
            id: event.pathParameters.id,
        },
    };
    dynamoDb.get(params, (err, result) => {
        if (err) {
            console.error(err);
            return {
                statusCode: err.statusCode || 501,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: "Couldn't get transaction"
            };
        }
        console.log(result);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    });
};
//# sourceMappingURL=handler.js.map