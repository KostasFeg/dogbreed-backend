const config = require('./utils/config');
const express = require('express');
const middleware = require('./utils/middleware');

const mongoose = require('mongoose');

const cors = require('cors');
const entriesRouter = require('./controllers/entries');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const imagesRouter = require('./controllers/file-upload');

app = express();
app.use(express.json());

app.use(middleware.tokenExtractor);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

app.use(cors());

//app.use(express.static('build'));

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/entries', entriesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
