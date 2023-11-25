var express = require('express');
var router = express.Router();

router.use('/player', require('./player'));

module.exports = router;