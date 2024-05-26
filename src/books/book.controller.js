const { Book } = require('./book.model.js');
const { Order } = require('./order.model.js');
const contactUs = require('../utils/mail.js');
const User = require('../user/user.model.js');


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, author, description, publicationYear, isbn, price, stock } = req.body;

    const book = new Book({
      title,
      author,
      description,
      publicationYear,
      isbn,
      price,
      stock
    });

    await book.save();

    res.status(201).json({ message: 'Product created successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Edit a product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, author, description, publicationYear, isbn, price, stock } = req.body;

    const book = await Book.findById(productId);
    if (!book) {
      return res.status(404).json({ message: 'Product not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.publicationYear = publicationYear || book.publicationYear;
    book.isbn = isbn || book.isbn;
    book.price = price || book.price;
    book.stock = stock || book.stock;
    book.updatedAt = Date.now();

    await book.save();

    res.status(200).json({ message: 'Product updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.deleteProduct =async (req,res)=>{
  try {
    const { productId } = req.params;

    const book = await Book.findById(productId);
    if (!book) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Book.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

// Buy an order
exports.buyProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const book = await Book.findById(productId);
    if (!book) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = await Order.create({
      user: userId,
      products: [{ product: productId, quantity }],
    });
    
    // Constructing the email content
    const name = `${user.firstName} ${user.lastName}`;
    const sub = 'Order Placed Successfully';
    const msg = `
    Hi ${name},

    Your order has been placed successfully.

    Order Details:
    Product Name: ${book.title}
    Quantity: ${quantity}

    We will mail you the tracking details once your order is shipped.

    Best regards,
    BookStore`;
      try {
          await contactUs({
              name,
              email: user.email,
              sub,
              msg
            });
      } catch (error) {
          console.log('Error sending email: ' + error);
          res.status(500).send('Error sending email');
      }


    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// userController.js

exports.getAllOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId }).populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId }).select('status');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// adminController.js
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


