const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const userRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const bookRoute = require("./routes/images");
const videoRoute = require("./routes/videos");

mongoose
  .connect("mongodb://localhost/resource-managment")
  .then(console.log("Connection to mongoDB is succesful."));

//

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

app.use("/resource-management/users", userRoute);
app.use("/resource-management/login", loginRoute);
app.use("/resource-management/books", bookRoute);
app.use("/resource-management/videos", videoRoute);

app.set("view engine", "ejs");

app.listen(3005, () => {
  console.log("Listening on Port 3005");
});
