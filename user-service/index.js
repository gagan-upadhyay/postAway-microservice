import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './src/services/routes/models/utils/db.js';
import router from './src/routes/postRoutes.js';
import compression from 'compression';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(compression());


app.use('/api/users', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
