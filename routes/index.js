var express = require('express');
var router = express.Router();

express.use('/users', require('./users'));