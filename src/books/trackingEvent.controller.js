const contactUs = require('../utils/mail');
const {Order} = require('./order.model');
const {TrackingEvent} = require('./trackingEvent.model');

// Create a tracking event
exports.createTrackingEvent = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, location } = req.body;
  
      const trackingEvent = new TrackingEvent({
        status,
        location,
        orderId
      });
  
      await trackingEvent.save();
  
    //   const order = await Order.findById(orderId);
    const order = await Order.findById(orderId);

      order.trackingEvents.push(trackingEvent);
      await order.save();
  
      res.status(201).json({ message: 'Tracking event created successfully', trackingEvent });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  
  // Retrieve tracking events for an order
  exports.getTrackingEvents = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId).populate('trackingEvents');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ trackingEvents: order.trackingEvents });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  
  exports.updateTrackingEvent = async (req, res) => {
    try {
      const { trackingEventId } = req.params;
      const { status, location } = req.body;
  
      const trackingEvent = await TrackingEvent.findById(trackingEventId);
  
      if (!trackingEvent) {
        return res.status(404).json({ message: 'Tracking event not found' });
      }
  
      const order = await Order.findById(trackingEvent.orderId).populate('user').populate('products.product');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const user = order.user;
      const product = order.products.find(p => p.product._id.toString() === trackingEvent.orderId.toString());
  
      trackingEvent.status = status;
      trackingEvent.location = location;
      trackingEvent.timestamp = Date.now();
  
      await trackingEvent.save();
  
      // Constructing the email content
      const name = `${user.firstName} ${user.lastName}`;
      const sub = 'Order Status Updated';
      const msg = `
      Hi ${name},
  
      Your order status has been updated.
  
      Order Details:
      Product Name: ${product.product.title}
      Quantity: ${product.quantity}
      Status: ${status}
      Location: ${location}
  
      We will mail you the tracking details once your order is shipped.
  
      Best regards,
      BookStore`;
  
      try {
        await contactUs({
          name,
          email: user.email,
          sub,
          msg,
        });
      } catch (error) {
        console.log('Error sending email: ' + error);
        return res.status(500).send('Error sending email');
      }
  
      res.status(200).json({ message: 'Tracking event updated successfully', trackingEvent });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  
  exports.deleteTrackingEvent = async (req, res) => {
    try {
      const { trackingEventId, orderId } = req.params;
  
      const trackingEvent = await TrackingEvent.findById(trackingEventId);
  
      if (!trackingEvent) {
        return res.status(404).json({ message: 'Tracking event not found' });
      }
  
      await TrackingEvent.deleteOne({ _id: trackingEventId });
  
      await Order.findByIdAndUpdate(orderId, { $pull: { trackingEvents: trackingEventId } });
  
      res.status(200).json({ message: 'Tracking event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  