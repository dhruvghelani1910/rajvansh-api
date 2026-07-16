import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import responseManager from '../../utilities/response.manager.js';
import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import dotenv from 'dotenv';

dotenv.config();

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return responseManager.sendError(res, 'Please provide username and password', null, 400);
    }

    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const UserModel = primary.model(constants.MODELS.users, User);

    // Find admin user
    const user = await UserModel.findOne({ username: username.toLowerCase(), role: 'admin' });

    if (!user) {
      return responseManager.sendError(res, 'Invalid admin username or password', null, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return responseManager.sendError(res, 'Invalid admin username or password', null, 401);
    }

    // Generate JWT token (use userid to align with req.token?.userid)
    const token = jwt.sign(
      { userid: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'shivbhavanisecretkey789goldencoffee',
      { expiresIn: '30d' }
    );

    return responseManager.sendSuccess(res, 'Admin Login successful', {
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return responseManager.sendError(res, 'Server error during admin login', error, 500);
  }
};

export default adminLogin;
