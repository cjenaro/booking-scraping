const puppeteer = require('puppeteer');
const express = require('express');
const booking = require('./routes/puppeteer.routes')

const app = express();

app.use('/booking', booking);

let port = 8080;

app.listen(port, () => {
    console.log('Server is running on https://localhost:8080/');
});
