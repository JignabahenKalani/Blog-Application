require("dontenv").config();

const Sequlize = require("sequlize");

if(process.env.DB_PASSWORD === "ChangeMe...."){
    console.error("Please update the database password in .env file.");
    process.exit(1);
}

const sequlize = process.env.JWSDB_URL
  ? new Sequlize(process.env.JWSDB_URL)
  : new Sequlize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT, 
    }
  );
module.exports = sequlize;