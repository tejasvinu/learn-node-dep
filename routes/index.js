var express = require('express');
var router = express.Router();

router.use('/player', require('./player'));
router.use('/match', require('./match'));
router.use('/auth', require('./auth-routes'));
module.exports = router;