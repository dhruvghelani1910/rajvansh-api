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

    const cleanInput = username.trim().toLowerCase();
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const UserModel = primary.model(constants.MODELS.users, User);

    // Find admin user by username or email
    const user = await UserModel.findOne({
      $or: [{ username: cleanInput }, { email: cleanInput }],
      role: 'admin'
    });

    if (!user) {
      console.log(`[AdminLogin Debug] User not found for username/email: "${cleanInput}"`);
      return responseManager.sendError(res, `Admin user '${username}' not found`, null, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[AdminLogin Debug] Password mismatch for user: "${user.username}"`);
      return responseManager.sendError(res, 'Incorrect password for admin user', null, 401);
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
    console.error('[AdminLogin Debug] Server error:', error);
    return responseManager.sendError(res, 'Server error during admin login', error, 500);
  }
};

export default adminLogin;
