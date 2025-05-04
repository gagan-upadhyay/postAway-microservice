import {body, validationResult} from 'express-validator';
import logger from '../utils/logger.js';

const postValidator = async(req, res, next)=>{
    const rule=[
        body('title').notEmpty().withMessage('Need title of post'),
        body('caption').notEmpty().withMessage('Need caption of post'),
        body('imageUrl').notEmpty().withMessage('Need Image Url of POst')
    ];
    await Promise.all(rule.map(validation=>validation.run(req)));
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        logger.error(errors.array()[0].msg);
        return res.status(422).json({errors:errors.array()[0].msg});
    }
    next();
}

export {postValidator};