import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (Need service account in production)
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running', timestamp: new Date() });
});

// Add routes here later
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
