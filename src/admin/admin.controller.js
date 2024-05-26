const ErrorHander = require("../utils/errorhander.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const User = require("../user/user.model.js");


// Get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ _id: { $ne: req.user.id } });
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  
  
  // Delete user
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    await User.deleteOne({ _id: req.params.id });
  
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  });