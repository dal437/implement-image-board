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
    models.ImagePostModel.find().populate('images').exec((err, posts) =>
    res.render('index.hbs', { posts }));
});

app.get('/image-posts/:slug', (req, res) => {
  
});

app.post('/new-image', (req, res) => {

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
  models.ImageModel.insertMany(images, (err, newImages) => {
    console.log(err);
    const imagesIds = newImages.map(x => x.id);
    if (!err) {
      const post = new models.ImagePostModel({
        title,
        images: imagesIds,
      });

      post.save((err, newPost) => {
        console.log(err);
        if (!err){
          res.redirect('/image-posts');
        }
      });
      console.log(newImages);
    }
  })

});

app.listen(3000);
