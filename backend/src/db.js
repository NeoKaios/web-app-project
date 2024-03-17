const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
connection.connect();

connection.query('SELECT * FROM users', (err, result) => {
  if (err && err.code == 'ER_NO_SUCH_TABLE') {
    console.log('Empty DB')
  }
  else {
    console.log(result);
  }
});

