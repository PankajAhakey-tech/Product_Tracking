const express = require("express");
const { getAllUsers, deleteUser } = require("./admin.controller.js");
const { createProduct,getAllOrdersForAdmin, updateProduct,deleteProduct} = require('../books/book.controller.js');

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/AuthMiddleware.js");
const { createTrackingEvent ,getTrackingEvents,
  updateTrackingEvent,
  deleteTrackingEvent,} = require("../books/trackingEvent.controller.js");

const router = express.Router();

router.route("/getAllUsers")
  .get(isAuthenticatedUser, authorizeRoles("admin", "director"), getAllUsers);

router.route("/deleteUser/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin", "director"), deleteUser);

  
  
// Product routes
router.post('/product/create', isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.post('/product/update/:productId', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/product/delete/:productId', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
  
// Order status update route
router.get('/product/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrdersForAdmin);
router.post('/product/order/:orderId/trackingEvent', isAuthenticatedUser, authorizeRoles('admin'), createTrackingEvent);
router.get('/product/order/:trackingEventId/trackingEvent', isAuthenticatedUser, getTrackingEvents);
router.put('/product/order/:trackingEventId/trackingEvent', isAuthenticatedUser, authorizeRoles('admin'), updateTrackingEvent);
router.delete('/product/order/:trackingEventId/trackingEvent', isAuthenticatedUser, authorizeRoles('admin'), deleteTrackingEvent);
  
  

module.exports = router;
