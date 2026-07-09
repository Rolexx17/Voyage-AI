const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const config = require('../config');
const { sendSuccess, sendError } = require('../utils/responseFormat');

class AuthController {
  // 1. REGISTER
  static async register(req, res) {
    try {
      const { name, email, password, style, budget, food, travelType, interests, hasPets } = req.body;

      // Cek apakah user sudah ada
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return sendError(res, 400, 'Email is already registered');
      }

      // Hash password
      const saltRounds = config.auth.saltRounds || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Simpan ke DB Supabase
      const newUser = await UserModel.create({
        name, email, password: hashedPassword, 
        style, budget, food, travelType, interests, hasPets
      });

      return sendSuccess(res, 201, 'User registered successfully', newUser);
    } catch (error) {
      console.error("❌ ERROR DI REGISTER:", error.message || error);
      return sendError(res, 500, 'Internal Server Error during registration');
    }
  }

  // 2. LOGIN
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return sendError(res, 401, 'Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return sendError(res, 401, 'Invalid credentials');
      }

      // Pastikan config.auth.jwtSecret terbaca
      const secret = config.auth.jwtSecret || 'default_secret_voyage';
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: '1d' }
      );

      return sendSuccess(res, 200, 'Login successful', { 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      });
    } catch (error) {
      console.error("❌ ERROR DI LOGIN:", error.message || error);
      return sendError(res, 500, 'Internal Server Error');
    }
  }

  // 3. UPDATE PROFILE (Fixed 500 Error & Added Validation/Logs)
  static async updateProfile(req, res) {
    try {
      const { id } = req.user; // Didapat dari middleware auth
      const { name, email } = req.body;

      // Validasi input dasar
      if (!name || !email) {
        return sendError(res, 400, 'Name and email are required fields');
      }

      // Cegah crash akibat unique constraint email di database
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return sendError(res, 400, 'This email address is already in use by another account');
      }

      // Eksekusi update ke database Supabase
      const updatedUser = await UserModel.updateBasicInfo(id, { name, email });
      
      return sendSuccess(res, 200, 'Profile updated successfully', updatedUser);
    } catch (error) {
      // LOG PENTING: Supaya error query Supabase kelihatan di log Render / terminal VS Code
      console.error("❌ ERROR DI UPDATE_PROFILE:", error.message || error);
      return sendError(res, 500, 'Internal Server Error while updating profile');
    }
  }

  // 4. CHANGE PASSWORD (Added Error Logs)
  static async changePassword(req, res) {
    try {
      const { id } = req.user;
      const { oldPassword, newPassword } = req.body;

      // Validasi input dasar
      if (!oldPassword || !newPassword) {
        return sendError(res, 400, 'Old password and new password are required');
      }

      // Ambil data user termasuk password aslinya
      const user = await UserModel.findById(id);
      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      // Verifikasi password lama
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return sendError(res, 401, 'Incorrect old password');
      }

      // Hash password baru & simpan
      const saltRounds = config.auth.saltRounds || 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await UserModel.updatePassword(id, hashedPassword);

      return sendSuccess(res, 200, 'Password changed successfully');
    } catch (error) {
      console.error("❌ ERROR DI CHANGE_PASSWORD:", error.message || error);
      return sendError(res, 500, 'Failed to change password');
    }
  }
}

module.exports = AuthController;