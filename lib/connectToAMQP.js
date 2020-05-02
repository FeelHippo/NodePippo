require('dotenv').config();
const amqplib = require('amqplib');

const connectionPromise = amqplib.connect(process.env.AMQP_CONNECTION_STRING);
// when the connection is established, the promise will be resolved
module.exports = connectionPromise;