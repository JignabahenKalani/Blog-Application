require("dotenv").config();
const Sequelize = require("sequelize");

if (process.env.DB_PASSWORD === "ChangeMe....") {
  console.error("Please update the database password in .env file.");
  process.exit(1);
}

const sequelize = process.env.JWSDB_URL
  ? new Sequelize(process.env.JWSDB_URL, {
      dialect: "mysql", 
      logging: false,
    })
  : new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || "mysql",
        port: process.env.DB_PORT,
        logging: false,
      }
    );

module.exports = sequelize;

