const express = require("express");
const route = express.Router();
const auth = require("../middlewares/auth");
const { Video } = require("../models/video");

route.get("/", async (req, res) => {
  const videos = await Video.find();
  res.send(videos);
});
route.get("/:id", async (req, res) => {
  const videos = await Video.findById(req.params.id);
  res.send(videos);
});
route.put("/:id", async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    filter: req.body.filter,
    year: req.body.year,
  });
  res.send(video);
});

route.post("/", async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      year: req.body.year,
      filter: req.body.filter,
      link: req.body.link,
    });
    await video.save();
    res.send(video);
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)));
  }
});
route.delete("/:id", async (req, res) => {
  try {
    const video = await Video.deleteOne({ _id: req.params.id });
    res.send(video);
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)));
  }
});
module.exports = route;
