const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const error = require('./middlewares/error');

const { PORT = 2800 } = process.env;
const app = express();
const allowedOrigins = ['http://localhost:5173'];

mongoose.set('strictQuery', false);

app.use(cors({
  origin: allowedOrigins,
}));
app.use(bodyParser.json());

app.use(router);
app.use(errors());
app.use(error);

mongoose
  .connect('mongodb://localhost:27017/vocord', {
    useUnifiedTopology: true, useNewUrlParser: true, autoIndex: true,
  });

app.listen(PORT, () => {
});
