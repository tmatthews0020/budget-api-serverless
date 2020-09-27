import { Kinesis } from "aws-sdk";

export const config = {
  apiVersions: {
    dynamodb: "2012-08-10",
    kinesis: "2013-12-02",
  },
  streams: {
    transactions: "transactions",
  },
};
