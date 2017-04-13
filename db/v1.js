const PgAsync = require('pg-async').default;

const pgAsync = new PgAsync('postgres://localhost:5432/barbieparty');

pgAsync.query(`CREATE SCHEMA IF NOT EXISTS salesforce`)
  .then(pgAsync.query(`CREATE TABLE IF NOT EXISTS salesforce.Contact (
    id SERIAL NOT NULL,
    sfid CHARACTER VARYING(18) UNIQUE DEFAULT substr(concat(md5(random()::text), md5(random()::text)), 0, 18),
    firstname CHARACTER VARYING(80),
    lastname CHARACTER VARYING(80)
  );`))
  .then(pgAsync.closeConnections());
