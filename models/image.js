const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: String,
  author: String,
  filter: String,
  year: Number,
  path: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports.Image = Image;
