import AWS from "aws-sdk";
import { config } from "../config/api-version";
import { Transaction } from "./transaction.interface";

const kinesis = new AWS.Kinesis({
  apiVersion: config.apiVersions.kinesis,
});

export const transactionProducer = async (transaction: Transaction) => {
  let param = {
    StreamName: config.streams.transactions,
    Data: transaction,
    PartitionKey: "transactions",
  };

  try {
    await kinesis.putRecord(param).promise();
  } catch (err) {
    console.error(err);
  }
};
