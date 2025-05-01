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

// Handle both Railway and local development
const getDbConfig = () => {

  if (process.env.DATABASE_URL) {
    try {
      const dbUrl = new URL(process.env.DATABASE_URL || process.env.MYSQL_URL);
 // Fixed typo here
      return {
        host: dbUrl.hostname,
        port: dbUrl.port,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.replace('/', ''),
        ssl: { rejectUnauthorized: false }
      };
    } catch (err) {
      console.error('❌ Error parsing DATABASE_URL:', err.message);
      process.exit(1);
    }
  }

  // For local development (using .env)
  console.log('⚠️ Using local database configuration');
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'railway',
    ssl: null // No SSL for local development
  };
};

const dbConfig = {
  ...getDbConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected to:', dbConfig.host);
    console.log('🔑 Using database:', dbConfig.database);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Connection failed to:', dbConfig.host);
    console.error('Error:', err.message);
    console.log('Current config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    process.exit(1);
  });

export default pool;