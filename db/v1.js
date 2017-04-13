const PgAsync = require('pg-async').default;

const pgAsync = new PgAsync('postgres://localhost:5432/barbieparty');

pgAsync.query(`CREATE SCHEMA IF NOT EXISTS salesforce`)
  .then(pgAsync.query(`CREATE TABLE IF NOT EXISTS salesforce.Contact (
    id SERIAL NOT NULL,
    sfid CHARACTER VARYING(18) UNIQUE,
    firstname CHARACTER VARYING(80),
    lastname CHARACTER VARYING(80),
    email CHARACTER VARYING(128),
    team__c CHARACTER VARYING(128),
    participant_type__c CHARACTER VARYING(128),
    location__longitude__s DOUBLE PRECISION,
    location__latitude__s DOUBLE PRECISION,
    session_id__c UUID
  );`))
  .then(pgAsync.closeConnections());
