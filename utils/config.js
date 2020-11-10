require('dotenv').config();

const PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID,
};
