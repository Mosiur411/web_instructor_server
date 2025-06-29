const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserRegisterType, Roles } = require("../utils/constants");
const { validateEmail } = require("../utils/validators");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} is not a valid email`
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    validate: {
      validator: function (role) {
        return UserRegisterType.has(role);
      },
      message: props => `${props.value} is not a valid role`
    },
    required: true,
    default: Roles.USER
  },
  photoURL: {
    type: String,
    default: 'https://example.com/default-profile.png',
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const saltRounds = parseInt(process.env.SALT_WORK_FACTOR, 10);
    if (isNaN(saltRounds) || saltRounds < 10 || saltRounds > 12) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(user.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ name: 1 });
userSchema.index({ role: 1 });

module.exports = {
  UserModel: mongoose.model('User', userSchema)
};