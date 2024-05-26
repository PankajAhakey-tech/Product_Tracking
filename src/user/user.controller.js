const ErrorHander = require("../utils/errorhander.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken");
const User = require("../user/user.model.js");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName,lastName, email, password ,phoneNumber} = req.body;
  // Concatenate countrycode and phoneNumber
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber
  });
  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Details with Uploaded File Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id; 
  const user = await User.findById( userId );
  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }
  res.status(200).json({ user});
});
