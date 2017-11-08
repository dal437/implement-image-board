//app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const session = require('express-session');
const models = require('./db');

// Server constants
/*const sessionOptions = {
    secret: 'secretWord',
    saveUninitialized: false,
    resave: false,
};*/

// Configure appi
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(session(sessionOptions));

// Set up routes
app.get('/image-posts', (req, res) => {
  models.ImagePostModel.find({},
    (err, posts) => res.render('index.hbs', { posts }));
});

app.post('/new-image', (req, res) => {
  console.log(req.body);

  const images = [];
  const title = req.body.title;

  for(let i = 1; i <= 3; i++){
    const url = req.body['image-url-' + i];
    const caption = req.body['caption-' + i];

    if (url){
      const image = new models.ImageModel({
        caption,
        url,
      });
      images.push(image);
    }
  }
  const post = new models.ImagePostModel({
    title,
    images,
  })

  console.log(images);
  console.log(post);
  res.redirect('/image-posts');
/*    const caption = req.body.caption;
    const url = req.body.url;
    const title = req.body.title;

    const image = new models.ImagePostModel({ title, images });
    if (req.session.addedImages) {
        req.session.addedImages.push(image.toObject());
    }
    else {
      req.session.addedImages = [image.toObject()];
    }
    image.save(() => res.redirect('/image-posts'));*/
});

app.listen(3000);
