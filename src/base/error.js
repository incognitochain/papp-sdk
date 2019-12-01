export const ERROR_CODE = {
  SEND_REQUEST_CANCELED: 'SEND_REQUEST_CANCELED',
  REQUEST_SEND_TX_TIMEOUT: 'REQUEST_SEND_TX_TIMEOUT'
};

export function sdkError(code, message) {
  return {
    code,
    message
  };
}