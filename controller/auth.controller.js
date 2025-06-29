const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorMessageFormatter } = require("../utils/helpers");
const { UserModel } = require("../model/user.model");
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  return jwt.sign({
    _id: user?._id,
    role: user?.role,
    email: user?.email,
    name: user?.name,
  }, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
};
const generateRefreshToken = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  return jwt.sign({
    _id: user?._id,
    role: user?.role,
    email: user?.email,
     name: user?.name,
  }, REFRESH_TOKEN_SECRET, { expiresIn: "17d" });
};

const  authregisterController = async (req, res) => {
  try {
    const { name, email, password, photoURL } = req.body; 

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    const newUser = new UserModel({ name, email, password, photoURL });
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.ENV !== 'dev', 
      sameSite: "Strict",
      maxAge: 17 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photoURL: newUser.photoURL
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};

const authLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }
    const newAccessToken = generateAccessToken(decoded);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};

const authLogoutController = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};


module.exports = {
  authLoginController,
  refreshTokenController,
  authLogoutController,
  authregisterController,
};
