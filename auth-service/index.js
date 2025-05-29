import express from 'express';
import authRouter from './src/routes/authRoutes.js';
import dotenv from 'dotenv';
import applySecurityMiddlewares from './src/middlewares/securityMiddlewares.js';
import connectDB from './src/utils/db.js';
import morgan from 'morgan';
import compression from 'compression';
import logger from './src/utils/logger.js';
dotenv.config();
const app = express();

app.use(express.json());
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(compression());

applySecurityMiddlewares(app);

app.use('/api/auth', authRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    // logger.error(err.stack);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
    // logger.info(`Server is running on port ${PORT}`);
    
});