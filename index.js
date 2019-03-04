const puppeteer = require("puppeteer");
const express = require("express");
const booking = require("./routes/puppeteer.routes");

const app = express();

app.use("/booking", booking);

var server = app.listen(process.env.PORT || 5000, () => {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
