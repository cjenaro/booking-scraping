const express = require('express');
const router = express.Router();

const puppeteer_controller = require('../controllers/puppeteer.controller');

router.get('/', puppeteer_controller.get_booking);

module.exports = router;
