function sendData(res, data) {
  res.send({ data }).status(200);
}

function sendError(res, error) {
  res.send({ error }).status(400);
}

module.exports = {
  sendData, sendError
};