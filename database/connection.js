var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'higor',
      password : '14785',
      database : 'api_users'
    }
  });

module.exports = knex