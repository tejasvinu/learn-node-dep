var express = require('express');
var router = express.Router();

router.use('/player', require('./player'));
router.use('/match', require('./match'));

module.exports = router;