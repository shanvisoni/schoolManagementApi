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

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Add SSL for Railway production
if (process.env.RAILWAY_ENVIRONMENT === 'production') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(dbConfig);

// Enhanced connection test
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to MySQL!');
    console.log('Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    conn.release();
  })
  .catch(err => {
    console.error('DATABASE CONNECTION FAILED!');
    console.error('Current configuration:', dbConfig);
    console.error('Full error:', err);
    process.exit(1); // Exit with error code
  });

export default pool;