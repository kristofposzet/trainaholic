const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  url: process.env.DB_URL,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
};
