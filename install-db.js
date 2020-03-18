'use strict';

const conn = require('./lib/connectMongoose');
const Ad = require('./models/Schema');

//initiate MongoDB collection
conn.once('open', async () => {
    try {
        await initModel();
        conn.close();
    } catch (error) {
        console.log('Something went wrong: ', error);
        process.exit(1);        
    }
});

//handle collection
async function initModel() {
    //initiate empty collection
    await Ad.deleteMany();
    await Ad.insertMany([
        {
            name: 'Table',
            sell: false,
            price: 500,
            picture: 'table.jpg',
            tags: ['Home', 'Furniture']
        },
        {
            name: 'Mountain Bike',
            sell: true,
            price: 150,
            picture: 'bike.jpg',
            tags: ['Bike', 'Sports']
        },
        {
            name: 'GameBoy',
            sell: false,
            price: 15,
            picture: 'gameboy.jpg',
            tags: ['Videogame', 'Nintendo']
        }
    ])
}