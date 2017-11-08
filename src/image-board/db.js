//db.js
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;
const MONGO_URI = 'mongodb://localhost/hw06';

// my schema goes here!
const Image = new Schema({
    caption: String,
    url: {type: String, required: true}
});

// my schema goes here!
const ImagePost = new Schema({
    title: String,
    images: [Image]
});

ImagePost.plugin(URLSlugs("title images"), {field: 'title'});

const ImageModel = mongoose.model('Image', Image);
const ImagePostModel = mongoose.model('ImagePost', ImagePost);

mongoose.connect(MONGO_URI);

module.exports = {
    ImageModel,
    ImagePostModel,
};
