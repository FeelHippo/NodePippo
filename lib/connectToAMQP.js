require('dotenv').config();
const amqplib = require('amqplib');

const connectionPromise = amqplib.connect(process.env.AMQP_CONNECTION_STRING);
// when the connection is established, the promise will be resolved
module.exports = connectionPromise;

// https://levelup.gitconnected.com/rabbitmq-with-docker-on-windows-in-30-minutes-172e88bb0808
// for Docker
// I have been having problems with Docker, fixed with
// https://stackoverflow.com/questions/48066994/docker-no-matching-manifest-for-windows-amd64-in-the-manifest-list-entries