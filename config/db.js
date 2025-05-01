// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv'; 

// dotenv.config(); 
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT, 
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// export default pool;








import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = {
  host: isProduction ? process.env.MYSQLHOST : process.env.DB_HOST,
  port: isProduction ? process.env.MYSQLPORT : process.env.DB_PORT || 3306,
  user: isProduction ? process.env.MYSQLUSER : process.env.DB_USER,
  password: isProduction ? process.env.MYSQLPASSWORD : process.env.DB_PASSWORD,
  database: isProduction ? process.env.MYSQLDATABASE : process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Add SSL only for production
if (isProduction) {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to MySQL database!');
    console.log(`Connected as user: ${dbConfig.user}@${dbConfig.host}`);
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:');
    console.error('Current DB config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    console.error('Full error:', err);
    process.exit(1);
  });

export default pool;