// src/backend/server.js
import express from 'express';
import bodyParser from 'body-parser';
import healthTipsRoutes from '../backend/routes/healthTips';

const app = express();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Use routes
app.use('/api/health-tips', healthTipsRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
