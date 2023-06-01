const mongoose = require("mongoose");
const videoSchema = mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  filter: { type: String, required: true },
  year: { type: Number, required: true },
});

const Video = mongoose.model("Video", videoSchema);
module.exports.Video = Video;
