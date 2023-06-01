const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const { Image } = require("../models/image");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage }).single("testImage");

route.post("/", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) console.log(err);
    else {
      const newImage = new Image({
        title: req.body.title,
        author: req.body.author,
        filter: req.body.filter,
        year: req.body.year,
        description: req.body.description,
        path: req.file.path,
        image: {
          data: req.file.filename,
          contentType: "application/pdf",
        },
      });
      await newImage.save();
      res.send("Done");
    }
  });
});
route.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    /* res.send(image[0]["image"]["data"]); */
    res.send(images);
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)));
  }
});
route.get("/download/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);
  res.download(image.path);
});
route.get("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    res.send(image);
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)));
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const image = await Image.deleteOne({ _id: req.params.id });
    res.send(image);
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)));
  }
});

route.put("/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      filter: req.body.filter,
      year: req.body.year,
    });
    res.send(image);
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)));
  }
});
module.exports = route;
