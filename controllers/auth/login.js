import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import customerSchema from '../../models/customer.js';
import jwt from 'jsonwebtoken';
import responseManager from '../../utilities/response.manager.js';
import dotenv from 'dotenv';

dotenv.config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return responseManager.sendError(res, 'Please provide username and password', null, 400);
    }

    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

    // Find customer by username (case-insensitive search is safer)
    const user = await CustomerModel.findOne({ username: username.toLowerCase() });

    if (!user) {
      return responseManager.sendError(res, 'Invalid username or password', null, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return responseManager.sendError(res, 'Invalid username or password', null, 401);
    }

    // Generate JWT token (use userid to align with req.token?.userid in other controllers)
    const token = jwt.sign(
      { userid: user._id, username: user.username, role: 'customer' },
      process.env.JWT_SECRET || 'shivbhavanisecretkey789goldencoffee',
      { expiresIn: '30d' }
    );

    return responseManager.sendSuccess(res, 'Login successful', {
      token,
      user: {
        username: user.username,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilepic: user.profilepic,
        role: user.role,
        cart: user.cart || [],
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    return responseManager.sendError(res, 'Server error during login', error, 500);
  }
};

export default login;
