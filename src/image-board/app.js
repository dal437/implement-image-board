//app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const models = require('./db');

// Configure app
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

// Set up routes
app.get('/image-posts', (req, res) => {
    models.ImagePostModel.find().populate('images').exec((err, posts) =>
    res.render('index.hbs', { posts }));
});

app.get('/image-posts/:slug', (req, res) => {
  models.ImagePostModel.findOne({slug: req.params.slug}).populate('images').exec((err, post) =>
  res.render('image-post-detail.hbs', { post }));
});

app.post('/add/image/:slug', (req, res) => {
  const caption = req.body.caption;
  const slug = req.params.slug;
  const url = req.body.url;

  const addedimage = new models.ImageModel({
    caption,
    url,
  });
  addedimage.save((err, newImageSaved) => {
    models.ImagePostModel.findOneAndUpdate({slug}, {$push: {images: newImageSaved._id}}, {new: true, upsert: true},
      (err, newPost) => res.redirect('/image-posts/' + slug));
  });
});

app.post('/delete/:postId', (req, res) => {
  const postId = req.params.postId;

  let ids;
  if (Array.isArray(req.body.id)){
    ids = req.body.id;
  }
  else {
    ids = [req.body.id];
  }

  models.ImagePostModel.findOne({_id: postId}, (err, post) => {
    for (const i in ids) {
      post.images.remove(ids[i]);
    }
    post.save(err => res.redirect('/image-posts/' + post.slug));
  });
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
  });

});

app.listen(3000);
