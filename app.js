// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import schoolRoutes from'./routes/schoolRoutes.js';
// import dotenv from 'dotenv'; 

// dotenv.config(); 
// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.use('/', schoolRoutes);
// app.use((req, res, next) => {
//     res.status(404).json({
//         success: false,
//         message: 'Resource not found'
//     });
// });
// app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
  
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });.





// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import schoolRoutes from './routes/schoolRoutes.js';
// import dotenv from 'dotenv';
// import pool from './config/db.js';

// dotenv.config({
//   path: process.env.NODE_ENV === 'production' 
//     ? '.env.production' 
//     : '.env.development'
// });

// console.log('Environment:', process.env.NODE_ENV || 'development');
// console.log('Database host:', process.env.MYSQLHOST || process.env.DB_HOST);


// const app = express();

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST']
// }));
// app.use(bodyParser.json());



// console.log('DATABASE_URL:', process.env.DATABASE_URL);
// console.log('NODE_ENV:', process.env.NODE_ENV);


// // Health check endpoint
// app.get('/', (req, res) => {
//   res.json({
//     status: 'API is running',
//     endpoints: {
//       addSchool: 'POST /api/addSchool',
//       listSchools: 'GET /api/listSchools?latitude=XX&longitude=XX'
//     }
//   });
// });

// // API routes with /api prefix
// app.use('/api', schoolRoutes);

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Resource not found'
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });


// // Add this temporary route to test connection
// app.get('/test-db', async (req, res) => {
//   try {
//     const conn = await mysql.createConnection({
//       host: process.env.MYSQLHOST,
//       port: parseInt(process.env.MYSQLPORT),
//       user: process.env.MYSQLUSER,
//       password: process.env.MYSQLPASSWORD
//     });
//     res.json({ success: true });
//     conn.end();
//   } catch (err) {
//     res.json({ success: false, error: err.message });
//   }
// });


// // Add health check endpoint
// app.get('/health', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT 1');
//     res.status(200).json({ 
//       status: 'OK',
//       database: 'connected',
//       port: PORT, // Add this line
//       host: process.env.HOSTNAME // Add this line
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'DOWN',
//       error: err.message,
//       port: PORT, // Add this line
//       host: process.env.HOSTNAME // Add this line
//     });
//   }
// });




// const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 8000); // Railway uses 8080
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });









import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import schoolRoutes from './routes/schoolRoutes.js';
import dotenv from 'dotenv';
import pool from './config/db.js';
import mysql from 'mysql2/promise'; // Added for test-db route

// 1. ENVIRONMENT CONFIGURATION - ADDED AT TOP
dotenv.config({
  path: process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development'
});

// 2. NETWORK CONFIGURATION - NEW
const HOST = '0.0.0.0'; // Crucial for Railway
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 8000);

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(bodyParser.json());

// Debug logs - MODIFIED
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Server will listen on:', `${HOST}:${PORT}`);
console.log('Database config:', {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || process.env.DB_PORT
});

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    endpoints: {
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools?latitude=XX&longitude=XX'
    }
  });
});

app.use('/api', schoolRoutes);

// Test endpoint - MODIFIED
app.get('/test-db', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT),
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD
    });
    res.json({ success: true });
    conn.end();
  } catch (err) {
    res.json({ 
      success: false, 
      error: err.message,
      config: {
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT
      }
    });
  }
});

// Health check - MODIFIED
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'OK',
      database: 'connected',
      server: `${HOST}:${PORT}`,
      environment: process.env.NODE_ENV
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message,
      server: `${HOST}:${PORT}`
    });
  }
});

// Error handlers (keep your existing 404 and 500 handlers)

// 3. SERVER STARTUP - MODIFIED
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔌 Listening on ${HOST}:${PORT}`);
});

// 4. GRACEFUL SHUTDOWN - NEW
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM signal. Closing server...');
  server.close(() => {
    console.log('🚪 Server closed');
    process.exit(0);
  });
});