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





import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import schoolRoutes from './routes/schoolRoutes.js';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(bodyParser.json());



console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);


// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    endpoints: {
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools?latitude=XX&longitude=XX'
    }
  });
});

// API routes with /api prefix
app.use('/api', schoolRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


// Add this temporary route to test connection
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
    res.json({ success: false, error: err.message });
  }
});


// Add health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'OK',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      database: 'disconnected',
      error: err.message
    });
  }
});




const PORT = process.env.PORT || 8000; // Railway uses 8080
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});