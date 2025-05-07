// utils/sanitize.js
// in order to use sanitize filed, sanitize each item of req.body individually
// e.g., const val = sanitizeField(req.body.val);
import xss from 'xss';
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === 'object') {
      obj[key] = sanitizeObject(obj[key]);
    }
  }
  return obj;
};

// Middleware to sanitize body, query, and params
export const sanitizeRequest = (req, res, next) => {
    if(req.params) sanitizeObject(req.params);
    if(req.query) sanitizeObject(req.query);
    if(req.body) {sanitizeObject(req.body); console.log("value of sanitize(req.body)", sanitizeObject(req.body));};
  next();
};

// Utility for sanitizing individual field
export const sanitizeField = (value) => {
  return typeof value === 'string' ? xss(value) : value;
};
