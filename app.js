import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import schoolRoutes from'./routes/schoolRoutes.js';
import dotenv from 'dotenv'; 

dotenv.config(); 
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', schoolRoutes);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});
app.get("/", (req, res) => {
    res.send("API is running...");
  });
  
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});