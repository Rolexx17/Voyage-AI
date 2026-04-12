const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const config = require('../config');
const { sendSuccess, sendError } = require('../utils/responseFormat');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, style, budget, food, travelType, interests, hasPets } = req.body;

      // 1. Cek apakah user sudah ada
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return sendError(res, 400, 'Email is already registered');
      }

      // 2. Hash password
      const saltRounds = config.auth.saltRounds || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 3. Simpan ke DB Supabase
      const newUser = await UserModel.create({
        name, email, password: hashedPassword, 
        style, budget, food, travelType, interests, hasPets
      });

      return sendSuccess(res, 201, 'User registered successfully', newUser);
    } catch (error) {
      // LOG PENTING: Agar kamu tahu error aslinya di terminal VS Code
      console.error("❌ ERROR DI REGISTER:", error.message);
      return sendError(res, 500, 'Internal Server Error during registration');
    }
  }

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
      console.error("❌ ERROR DI LOGIN:", error.message);
      return sendError(res, 500, 'Internal Server Error');
    }
  }


  static async updateProfile(req, res) {
    try {
      const { id } = req.user; // Didapat dari middleware auth (akan dibuat di bawah)
      const { name, email } = req.body;

      const updatedUser = await UserModel.updateBasicInfo(id, { name, email });
      return sendSuccess(res, 200, 'Profile updated successfully', updatedUser);
    } catch (error) {
      return sendError(res, 500, 'Failed to update profile');
    }
  }

  static async changePassword(req, res) {
    try {
      const { id } = req.user;
      const { oldPassword, newPassword } = req.body;

      // 1. Ambil data user termasuk password aslinya
      const user = await UserModel.findById(id);

      // 2. Verifikasi password lama
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return sendError(res, 401, 'Incorrect old password');
      }

      // 3. Hash password baru & simpan
      const hashedPassword = await bcrypt.hash(newPassword, config.auth.saltRounds);
      await UserModel.updatePassword(id, hashedPassword);

      return sendSuccess(res, 200, 'Password changed successfully');
    } catch (error) {
      return sendError(res, 500, 'Failed to change password');
    }
  }
}

module.exports = AuthController;