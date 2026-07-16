import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../utilities/connections.js';
import UserSchema from '../models/user.js';
import constants from '../utilities/constants.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    const conn = await connectDB; // Wait for mongo connection
    const primary = conn.useDb(constants.DEFAULT_DB);
    const UserModel = primary.model(constants.MODELS.users, UserSchema);

    // Find admin user
    let admin = await UserModel.findOne({ username: 'admin' });
    if (!admin) {
      console.log("Admin user not found. Creating a new one...");
      admin = new UserModel({
        username: 'admin',
        password: 'admin123',
        email: 'admin@rajvansh.com',
        role: 'admin'
      });
    } else {
      console.log("Admin user found. Updating password to admin123 and role to admin...");
      admin.password = 'admin123';
      admin.role = 'admin';
      if (!admin.email) {
        admin.email = 'admin@rajvansh.com';
      }
    }

    await admin.save();
    console.log("Admin user updated successfully in database!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating admin user:", error);
    process.exit(1);
  }
};

resetAdmin();
