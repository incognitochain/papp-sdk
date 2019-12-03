export const ERROR_CODE = {
  SEND_REQUEST_CANCELED: 'SEND_REQUEST_CANCELED',
  REQUEST_SEND_TX_TIMEOUT: 'REQUEST_SEND_TX_TIMEOUT',
  SEND_TX_ERROR: 'SEND_TX_ERROR',
  USER_CANCEL_SEND_TX: 'USER_CANCEL_SEND_TX'
};

export function sdkError(code, message) {
  return {
    code,
    message
  };
}