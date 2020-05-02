// set up AMQP to create a queue to handle all recently submitted ads
const connectionPromise = require('../lib/connectToAMQP');
// import popups library to display latest ad submitted 
// var popupS = require('popups');

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
    channel.prefetch(1)

    // subscribe to a Q
    channel.consume(qName, msg => {
        // do the dirty work in here, see documentation
        // when done, I acknowledge receipt and processing:
        channel.ack(msg)
        // see output below, the same can be converted into an object with json.parse()
        console.log(msg.content.toString());

        // display new Ads in a modal
        popupS.modal({
            title:   'Latest Ad submitted: ' + msg.text,
            content: {
                tag: msg.tags[0] + ', ' + msg.tags[1],
                src: msg.thumb_path
            }
        });

        
    })
}
