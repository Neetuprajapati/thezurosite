// require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
// const { Pool } = require("pg");

// const pool = new Pool({
//   user:     process.env.DB_USER,
//   host:     process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port:     process.env.DB_PORT,
// });

// pool.connect()
//   .then(() => console.log("✅ Database connected"))
//   .catch(err => console.error("❌ Database error:", err.message));

// module.exports = pool;


require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
});

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ Database error:", err.message));

module.exports = pool;