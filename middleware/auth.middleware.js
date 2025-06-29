const jwt = require("jsonwebtoken");
const { errorMessageFormatter } = require('../utils/helpers')
const { UserModel } = require("../model/user.model");
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;



const authRqeuired = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ error: 'Authentication Required.' });

    const token = authorization.split('Bearer ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Access token expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!decoded?._id) return res.status(401).json({ error: 'Unauthorized User' });
    const userInfomation = await UserModel.findById({ _id: decoded?._id });
    req.user = {
      email: userInfomation?.email,
      _id: userInfomation?._id,
      role: userInfomation?.role,
      name: userInfomation?.name,
    };
    next()

  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};
module.exports = {
  authRqeuired,
}