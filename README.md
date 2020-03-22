# NodePippo 
---
## Install
### to initialize the database, run 
```javascript
npm run install-db
```
---
## API Methods
### list of ads
```javascript
    // index.js
    router.get('/', async (req, res, next) => {
        try {
            let tags = [];
            const URL_API = (req.url === '/') ? 
                'http://localhost:3000/api/ads'   
                : `http://localhost:3000/api/ads?${typeof req.query.tags == Array ? req.query.tags.map(tag => `tags=${tag}&`).join('') : `tags=${req.query.tags}&`}sell=${req.query.sell}&min=${req.query.min}&max=${req.query.max}&name=${req.query.name}`
                
            let chunk = await axios.get(URL_API);
            if(chunk) {
            chunk.data.map(el => {
                tags = [...tags, ...el.tags];
            });
            var unique_tags = tags.filter((v, i, a) => a.indexOf(v) === i);
            };    

            res.render('index', { title: 'NodePippo API', chunk: chunk.data, tags: unique_tags });
        } catch (error) {
            console.log('Could not retrieve data: ', error);
            next(1);
        }
        });
    // ads.js
    router.get('/', async (req, res, err) => {
        try {
            const params = filter_ads(req);
            console.log(params);
            const ads = await Ad.find(params).exec(function (err, data) {
                res.json(data);
            });
        
        } catch (error) {
            console.log(error);
            next(err);        
        }
    });
```
##### simple vanilla validation, when the client navigates to '/' the view will print all available ads. I didn't add a numeric limit to that, as I so not expect to grow very large. 
---
### add an ad
```javascript
    // app.js
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname + path.extname(file.originalname))
        }
        });

    const upload = multer({ storage: storage });

    ...

    app.post('/form', upload.single('picture'), async (req, res) => {
        try {
            debug(req.file);
            console.log('storage location is ' + req.hostname + '/' + req.file.path);
            await axios.post('http://localhost:3000/api/ads', {
            name: req.body.name,
            sell: req.body.sell,
            price: req.body.price,
            picture: req.file.filename,
            tags: [req.body.tag1, req.body.tag2]
            });
            
            res.redirect('..');
        } catch (error) {
            console.log(error)
        };  
        });
    // ads.js
    router.post('/', [
        check('name').isAlphanumeric().withMessage('Must be only alphabetical chars'),
        check('sell').isBoolean(),
        check('price').isNumeric().withMessage('Must be a valid number'),
        check('picture').exists(),

    ],async (req, res, err) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
    }
            const newAd = new Ad(req.body);
            const savedAd = await newAd.save();   
            res.end();
            
        } catch (error) {
            console.log(error);
            
        }
    });
    
```
##### I have used Multer, a node.js middleware for handling multipart/form-data, to handle picture uploads. The middleware renames the document, and stores it inside public/images. When an ad is added with a POST request, and for the sake of this assignment, the picture will be renamed, and saved inside the public folder. GET requests will retrieve the Schema from Mongoose, and use the file name to load the actual picture from public/images. POST requests validate requests with express-validator
---
### delete an ad
```javascript
    // app.js
    app.get('/:id', async (req, res) => {
        try {
            console.log(req.params);
            
            await axios.delete(`http://localhost:3000/api/ads/${req.params.id}`, req);
            res.redirect('/')
        } catch (error) {
            console.log(error);
            
        }
    })

    // ads.js
    router.delete('/:id', async (req, res, next) => {
        try {
            
            const _id = req.params.id;
            await Ad.deleteOne({ _id: _id });
            res.end();
        } catch (error) {
            console.log(error);
            
        }
    });
    
```
##### I had little bit of time on my hands, and thought "oh, well, let's implement a little extra functionality". No rocket science, but the DELETE method is very useful when it comes to handling the entire API. 

---

### Last but not least, big shout-out to https://www.getpapercss.com for the CSS library
