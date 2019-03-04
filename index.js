const puppeteer = require("puppeteer");
const express = require("express");
const booking = require("./routes/puppeteer.routes");

const app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
app.use("/booking", booking);

var server = app.listen(process.env.PORT || 5000, () => {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
