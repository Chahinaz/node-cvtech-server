const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
   connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
   console.log("Connected to the database.\n");
});

/** Table creation */
const createTable = () => {
  const profileTable = `CREATE TABLE IF NOT EXISTS profile(
        id UUID PRIMARY KEY,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(75) NOT NULL,
        description VARCHAR(75),
        skills VARCHAR(100),
        sector VARCHAR(50),
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    )`;

  pool.query(profileTable).then((res) => {
      console.log("res == " + res + ".\n");
      pool.end();
  }).catch((err) => {
      console.log("err == " + err + ".\n");
      pool.end();
  })
};

/** Drop Table */
const dropTable = () =>{
  const profileTable = `DROP TABLE IF EXISTS profile`;

  pool.query(profileTable).then((res) => {
      console.log("res == " + res +" .\n");
      pool.end();
  }).catch((err) => {
      console.log("err == " + err + " .\n");
      pool.end();
  })
};

pool.on('remove', () => {
   console.log("Client removed.\n");
   process.exit(0);
});

module.exports = {
  createTable,
  dropTable
};

require('make-runnable');
