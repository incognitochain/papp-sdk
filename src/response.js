function sendData(res, data) {
  console.debug('Response data', data);
  res.status(200).send({ data });
}

function sendError(res, error) {
  console.debug('Response error', error);
  res.status(400).send(error);
}

module.exports = {
  sendData, sendError
};