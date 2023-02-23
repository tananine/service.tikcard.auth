const bodyParser = require('body-parser');
const express = require('express');

const authRouter = require('./routes/auth.routes');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3001);
