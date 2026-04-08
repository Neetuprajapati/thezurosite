const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "thezuro",   // tumhara DB name
  password: "ViTi@123",
  port: 5432,
});

module.exports = pool;