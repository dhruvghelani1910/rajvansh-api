import jwt from 'jsonwebtoken';
import responseManager from '../utilities/response.manager.js';
import dotenv from 'dotenv';

dotenv.config();

const protect = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shivbhavanisecretkey789goldencoffee');
      req.user = decoded;
      return next();
    } catch (error) {
      return responseManager.sendError(res, 'Not authorized, token failed', error, 401);
    }
  }

  if (!token) {
    return responseManager.sendError(res, 'Not authorized, no token provided', null, 401);
  }
};

export default protect;
