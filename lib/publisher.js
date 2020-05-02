// set up AMQP to create a queue to handle all recently submitted ads
const connectionPromise = require('../lib/connectToAMQP');
const path = require('path');

// import Jimp, to create thumbnails
var Jimp = require('jimp');


module.exports = function() {
    return async (req, res, next) => {
        try {
            // get file name
            const latestAd = path.join(__dirname, '../public/images/', req.file.filename); 
            // define queue
            const qName = 'latestAds'; 

            // connect to amqp server
            const conn = await connectionPromise;

            // connect to a channel
            const channel = await conn.createChannel();

            // make sure there is an active Q
            await channel.assertQueue(qName, {
                durable: true, // the Q persists when the broker is restarted, true == message will be saved to hard disk, false == memory only
            });

            // define the message, which will contain the name of the newly added ad, and the relative path to its thumbnail
            const message = {
                text: req.body.name,
                thumb_path: path.join(__dirname, '../public/images/thumb_' + req.file.filename),
                tags: [req.body.tag1, req.body.tag2]
            }
            
            // resize image and send to Q
            Jimp.read( latestAd )
                .then(image => {
                    // scale down to 30% of original size
                    image.scale( 0.3, (err, image) => {
                        // save the thumbnail to disc, same directoy as full size images, but the name is preceded by 'thumb_'
                        image.write(message.thumb_path, (err) => {
                            if(err) { console.log(err) }
                            // send the task to the Q
                            channel.sendToQueue(qName, Buffer.from(JSON.stringify(message)), {
                                persistent: true,   // message will survive broker restarts, if it belongs to a Q that also persists. true = message will be saved to hard disk, false = memory only
                                                    // sendToQueue returns a boolean. true if message was sent to Q
                            });
                        })
                    });
                })
                .catch(err => {
                    console.log('An error occurred while resizing the picture ', err);
                    
                });    
        } catch (error) {
            console.log(error);
        }
    }
}
