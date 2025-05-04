import {body, validationResult} from 'express-validator';
import logger from '../utils/logger.js';

const registerValidator = async (req, res, next) => {
    const rule=[
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Email is required'),
        body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
        body('gender').isIn(['Male', 'Female']).withMessage('Please mention gender as "Male" or "Female"!')
    ];
    await Promise.all(rule.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        logger.error(errors.array()[0].msg);
        return res.status(422).json({errors:errors.array()[0].msg});
    }
    next();
}

const bulkRegisterValidator = async (req, res, next) => {
    const rule=[
        body('users').isArray().withMessage('Users is required')
    ];
    await Promise.all(rule.map(validation => validation.run(req)));
    // logger.debug("Value of users from bulk-register: ",req.body.users);
    const errors = validationResult(req);
    // logger.error("Value of errors from bulk-register: ",errors);
    if(!errors.isEmpty()){
        logger.error(errors.array()[0].msg);
        return res.status(422).json({errors:errors.array()[0].msg});
    }
    next();
}

const loginValidator = async (req, res, next) => {
    const rule=[
        body('email').isEmail().withMessage('Email is required'),
        body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
    ];
    await Promise.all(rule.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()[0].msg});
    }
    next();
}

export {registerValidator, loginValidator, bulkRegisterValidator};