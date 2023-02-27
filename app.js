const bodyParser = require('body-parser');
const express = require('express');
const rateLimit = require('express-rate-limit');

const { client } = require('./helpers/createRedis');
client.connect();

const authRouter = require('./routes/auth.routes');

const app = express();
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: 'Too many requests',
});

app.use('/auth', limiter, authRouter);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3001);
