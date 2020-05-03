const request = require('supertest');
const app = require('../app');
const Ad = require('../models/Schema');

// super test testing
describe('Post Endpoints', () => {
    it('[NO AUTH] POST /api/ads should create a new ad', async () => {
        await request(app)
            .post('/api/ads')
            .send({
                name: 'itemName',
                sell: true,
                price: 10,
                picture: 'pic.jpg',
            }).expect(200);
    });

    const ad_id = "5eae8e24f2f0d33648df1d66";

    test('[NO AUTH] DELETE /deleteAd/:id', async () => {
        jest.setTimeout(10000);
        await request(app)
            .delete(`/deleteAd/${ad_id}`)
            expect(200);
    })
});