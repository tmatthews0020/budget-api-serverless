export const getCognitoUserId = (event: any): string => {
  if (event && event.cognitoPoolClaims.sub) {
    return event.cognitoPoolClaims.sub.toString();
  }
};
