const express=require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
} = require("../user/user.controller");
const {getAllProducts, buyProduct, getOrderDetails, getAllOrdersForUser} = require('../books/book.controller.js');

const { isAuthenticatedUser } = require("../middleware/AuthMiddleware.js");
const { getTrackingEvents } = require("../books/trackingEvent.controller.js");


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.get("/profile",isAuthenticatedUser,getUserDetails);
// Product routes
router.get('/products', isAuthenticatedUser, getAllProducts);
router.post('/product/buyProduct/:productId', isAuthenticatedUser, buyProduct);
router.get('/product/orders', isAuthenticatedUser,getAllOrdersForUser);
router.get('/product/orders/:orderId', isAuthenticatedUser, getOrderDetails);
router.get('/product/order/:orderId/track', isAuthenticatedUser,getTrackingEvents);

module.exports = router;