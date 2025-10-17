import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// 注册用户
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ 新增
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 登录用户
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ 新增
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 获取当前登录用户信息
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role, // ✅ 新增
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
