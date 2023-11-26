require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const cors = require('cors');
const ecors = require('express-cors');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api', indexRouter);

app.use(cors());
app.use(ecors());

console.log('Hello World!');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
