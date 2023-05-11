require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const rateLimit = require('express-rate-limit');

const { client } = require('./functions/createRedis');
client.connect();

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');

const app = express();
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: 'Too many requests',
});

app.use('/auth', limiter, authRouter);
app.use('/account', limiter, accountRouter);

app.use((error, req, res, next) => {
  const showClientMessage = error.showClientMessage;
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data, showClientMessage });
});

const PORT = process.env.PORT;
const listener = app.listen(PORT, () =>
  console.log('Server started on port ' + listener.address().port)
);
