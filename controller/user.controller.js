const { UserModel } = require("../model/user.model");
const { errorMessageFormatter } = require("../utils/helpers");

const getuserprofileController = async (req, res) => {
  try {
    const {_id} =req.user;

    const user = await UserModel.findById(_id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};

const updateuserprofileController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, photoURL } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, photoURL },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (err) {
    const errorMessage = errorMessageFormatter(err);
    return res.status(500).json(errorMessage);
  }
};

module.exports = {
  getuserprofileController,
  updateuserprofileController
};