import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import customerSchema from '../../models/customer.js';
import jwt from 'jsonwebtoken';
import responseManager from '../../utilities/response.manager.js';
import dotenv from 'dotenv';

dotenv.config();

const register = async (req, res) => {
  try {
    const { username, surname, email, phone, address, profilepic, password } = req.body;

    if (!username || !email || !password) {
      return responseManager.sendError(res, 'Please provide username, email and password', null, 400);
    }

    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

    // Check if user already exists
    const existingUser = await CustomerModel.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });
 
    if (existingUser) {
      return responseManager.sendError(res, 'Username or email already in use', null, 409);
    }
 
    // Create new customer
    const newUser = new CustomerModel({
      username,
      surname,
      email,
      phone,
      address,
      profilepic,
      password,
      role: 'customer' // default role
    });

    await newUser.save();

    // Generate JWT token (use userid to align with req.token?.userid)
    const token = jwt.sign(
      { userid: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'shivbhavanisecretkey789goldencoffee',
      { expiresIn: '30d' }
    );

    return responseManager.sendSuccess(res, 'Registration successful', {
      token,
      user: {
        username: newUser.username,
        surname: newUser.surname,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        profilepic: newUser.profilepic,
        role: newUser.role,
        cart: newUser.cart || [],
        wishlist: newUser.wishlist || []
      }
    }, 201);
  } catch (error) {
    return responseManager.sendError(res, 'Server error during registration', error, 500);
  }
};

export default register;
