import mysql from 'mysql2/promise'

const connection = mysql.createConnection({
  host: "localhost",
  database: process.env.database,
  user: process.env.db_username,
  password: process.env.db_password,
  port: process.env.db_port,
  timezone: '+00:00'
})

connection.then(connection => {
  connection.query(`SET time_zone="+00:00";`)
})

export default await connection
