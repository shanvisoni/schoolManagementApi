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




// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// const dbConfig = {
//   host: process.env.MYSQLHOST || 'mysql.railway.internal' || process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
//   user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
//   password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
//   database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'railway',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: process.env.RAILWAY_ENVIRONMENT === 'production' ? 
//     { rejectUnauthorized: false } : null
// };





// const pool = mysql.createPool(dbConfig);

// // Connection test and table initialization
// const initialize = async () => {
//   try {
//     const conn = await pool.getConnection();
//     console.log('✅ Database connected to:', dbConfig.host);
    
//     await conn.query(`
//       CREATE TABLE IF NOT EXISTS schools (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         address VARCHAR(255) NOT NULL,
//         latitude FLOAT NOT NULL,
//         longitude FLOAT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//       )
//     `);
//     console.log("✅ Schools table ready");
    
//     conn.release();
//   } catch (err) {
//     console.error('❌ Initialization failed:', err.message);
//     process.exit(1);
//   }
// };

// initialize();
// export default pool;






import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.RAILWAY_ENVIRONMENT === 'production';

const dbConfig = {
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  port: parseInt(process.env.MYSQLPORT || '3306'), // Default to 3306 if not set
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'qfPcyjsueiBBMPdYdZGwgJAAGeIOetqh',
  database: process.env.MYSQLDATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Remove SSL for internal Railway connections
  ssl: process.env.RAILWAY_ENVIRONMENT === 'production' && 
       !process.env.MYSQLHOST.includes('railway.internal') ? 
       { rejectUnauthorized: false } : null
};

const pool = mysql.createPool(dbConfig);

const initialize = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database connected to:', dbConfig.host);
    console.log('🔧 Mode:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Schools table ready");
    conn.release();
  } catch (err) {
    console.error('❌ Initialization failed:', err.message);
    process.exit(1);
  }
};

initialize();
export default pool;