import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import {authLimiter} from './rateLimiter.js';
import cors from 'cors';

const applySecurityMiddlewares=(app)=>{
    app.use(helmet());
    // app.use(ExpressMongoSanitize());
    // app.use(xss());
    app.use(hpp());
    app.use(authLimiter);
    app.use(cors({
        origin:process.env.FRONTEND_URL|| '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials:true
    }));
};
export default applySecurityMiddlewares;