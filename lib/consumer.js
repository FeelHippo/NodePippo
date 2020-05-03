// set up AMQP to create a queue to handle all recently submitted ads
const connectionPromise = require('../lib/connectToAMQP');

// define queue
const qName = 'latestAds';

main().catch( err => console.log(err))

async function main() {

    // connect to amqp server
    const conn = await connectionPromise;

    // connect to a channel
    const channel = await conn.createChannel();
    
    // make sure there is an active Q
    await channel.assertQueue(qName, {});

    // set number of messages processed in parallel
    channel.prefetch(10)

    // subscribe to a Q
    channel.consume(qName, msg => {
        // do the dirty work in here, see documentation
        // when done, I acknowledge receipt and processing:
        channel.ack(msg)
        // see output below, the same can be converted into an object with json.parse()
        console.log(msg);

        // tested with https://roedeer.rmq.cloudamqp.com, works fine        
    })
}
