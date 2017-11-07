//app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const models = require('./db');

// Server constants
const sessionOptions = {
    secret: 'secretWord',
    saveUninitialized: false,
    resave: false,
};

// Configure appi
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOptions));

// Set up routes
app.get('/image-posts', (req, res) => {
    const t = req.query.title;
    const obj = {};
    if (t) {
        obj.title = t;
    }
    models.ImagePostModel.find(obj,
        (err, image) => res.render('index.hbs', { image }));
});

app.post('/new-image', (req, res) => {
    const caption = req.body.caption;
    const url = req.body.url;
    const title = req.body.title;

    const image = new models.ImagePostModel({ title, images });
    if (req.session.addedImages) {
        req.session.addedImages.push(image.toObject());
    }
    else {
      req.session.addedImages = [image.toObject()];
    }
    image.save(() => res.redirect('/image-posts'));
});

app.listen(3000);
