require("dotenv").config();
module.exports.port = 5000;

module.exports.pageLimit = 10;

module.exports.SALT_LENGTH = 10;
module.exports.JWT_KEY = "E_C0mmerc_@pp_J$0n_Web_+0ken_Key";
module.exports.JWT_OPTIONS = {
  expiresIn: "5h",
};
module.exports.dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};
