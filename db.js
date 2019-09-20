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
const createProfileTable = () => {
  const profileTable = `CREATE TABLE IF NOT EXISTS profile(
        id UUID PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        description text,
        skills VARCHAR(100),
        sector VARCHAR(100),
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

const createOfferTable = () => {
  const offerTable =   `CREATE TABLE IF NOT EXISTS offer(
        id UUID PRIMARY KEY,
        sector VARCHAR(100) NOT NULL,
        post text NOT NULL,
        description text NOT NULL,
        missions text,
        neededProfile text,
        contractType text,
        localisation text,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    )`;

  pool.query(offerTable).then((res) => {
      console.log("res == " + res + ".\n");
      pool.end();
  }).catch((err) => {
      console.log("err == " + err + ".\n");
      pool.end();
  })
};

/** Drop Table */
const dropProfileTable = () =>{
  const profileTable = `DROP TABLE IF EXISTS profile`;

  pool.query(profileTable).then((res) => {
      console.log("res == " + res +" .\n");
      pool.end();
  }).catch((err) => {
      console.log("err == " + err + " .\n");
      pool.end();
  })
};

const dropOfferTable = () => {
  const offerTable = `DROP TABLE IF EXISTS offer`;

    pool.query(offerTable).then((res) => {
        console.log("res == " + res +" .\n");
        pool.end();
    }).catch((err) => {
        console.log("err == " + err + " .\n");
        pool.end();
    })
};

const createAllTables = () => {
  createOfferTable();
  createProfileTable();
};

const dropAllTables = () => {
  dropOfferTable();
  dropProfileTable();
};

pool.on('remove', () => {
   console.log("Client removed.\n");
   process.exit(0);
});

module.exports = {
  createProfileTable,
  dropProfileTable,

  createOfferTable,
  dropOfferTable,

  createAllTables,
  dropAllTables
};

require('make-runnable');
