const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDatabase = async (mongodb_uri) => {
  try {
    await mongoose.connect(mongodb_uri);
  } catch (error) {
    console.error("❌ Database error:", error);
  }
};

module.exports = {
  connectDatabase
};