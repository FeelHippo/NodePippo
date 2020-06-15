# NodePippo 

## AWS deployment:
[ReactJS application](http://3.22.100.95)
[ExpressJS application](http://ec2-3-22-100-95.us-east-2.compute.amazonaws.com)

Please use the following dummy users to access the Node app:
- user mario@bros.com, password mario
- user luigi@bros.com, password luigi
- user wario@bros.com, password wario

### Look forward to your feedback!

---
A Restful API built with NodeJS, Express, and MongoDB.
---
## Installation
### to initialize the database, run:
```javascript
npm run install-db
```
This will provide three mock ads to start with.<br/>
All configuration values are stored in a .env file, you must copy or rename ".env.example" to ==> ".env" locally, and insert your own environment configuration. 

```shell
cp .env.example .env
```
## @feelhippo/translate
This API relies on my translation NPM package: [@feelhippo/translate](https://github.com/FeelHippo/npm-translate-module)<br/>

This tiny and KISS package allows you to automatically translate your locales from English to 20 other languages.<br/> The package relies on Yandex's Translate API, which for single words and short sentences is just perfect.<br/> Once you have imported it, you only have to provide it with the route to your locale and voila'!<br/>
To install it:
```shell
$ npm install @feelhippo/translate
```
Since it will only be used in development, the package is called from "translateLocales.js", located in the root directory of the project, and which should not be used in production.<br/>
To translate all of the i18n locales:<br/>
```javascript
// package.json
"scripts": {
    "translate": "node translateLocales.js"
}
```
and then:
```shell
$ npm run translate
```
<br/>
Now it's time to start the server:<br/>

```shell
npm start
```
---
## REST API
### GET list of ads
```
https://localhost:3000/api/ads
```
#### Response
```
[
    {
    "tags": [
        "First",
        "Second"
    ],
    "_id": "5eb1a1f71834e346749a3980",
    "name": "String",
    "sell": Bool,
    "price": Number,
    "picture": "String",
    "__v": 0
    },
    ...
]
```
---
### POST add a new ad
```
https://localhost:3000/api/ads
```
#### Request
```
await axios.post('https://localhost:3000/api/ads', {
      name: req.body.name,
      sell: req.body.sell,
      price: req.body.price,
      picture: req.file.filename,
      tags: [req.body.tag1, req.body.tag2]
    });
```
##### I have used Multer, a node.js middleware for handling multipart/form-data, to handle picture uploads. The middleware renames the document, and stores it inside public/images. When an ad is added with a POST request.
---
### DELETE an ad
```
https://localhost:3000/deleteAd/:id
```
#### Please note:
The middleware uses a JWT Authorization token to validate the request, so that only registered user are allowed to delete ads.<br/>
```javascript
app.use('/deleteAd/:id', jwtAuth(), require('./routes/api/deleteAd'));
``` 

---

