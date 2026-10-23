const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let carts = {};
let orders = [];
let orderIdCounter = 1000;

// Routes

// GET all carts (for admin/debug)
app.get('/api/carts', (req, res) => {
    res.json(carts);
});

// GET all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// POST: Add item to cart
app.post('/api/cart/add', (req, res) => {
    const { item, price, quantity } = req.body;
    const sessionId = req.headers['x-session-id'] || 'guest';

    if (!carts[sessionId]) {
        carts[sessionId] = [];
    }

    const existingItem = carts[sessionId].find(i => i.name === item);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carts[sessionId].push({
            id: Date.now(),
            name: item,
            price: price,
            quantity: quantity
        });
    }

    res.json({
        success: true,
        message: `${item} added to cart`,
        cartItems: carts[sessionId]
    });
});

// POST: Update item quantity
app.post('/api/cart/update', (req, res) => {
    const { id, quantity } = req.body;
    const sessionId = req.headers['x-session-id'] || 'guest';

    if (carts[sessionId]) {
        const item = carts[sessionId].find(i => i.id === id);
        if (item) {
            item.quantity = quantity;
        }
    }

    res.json({
        success: true,
        message: 'Item updated',
        cartItems: carts[sessionId]
    });
});

// POST: Remove item from cart
app.post('/api/cart/remove', (req, res) => {
    const { id } = req.body;
    const sessionId = req.headers['x-session-id'] || 'guest';

    if (carts[sessionId]) {
        carts[sessionId] = carts[sessionId].filter(i => i.id !== id);
    }

    res.json({
        success: true,
        message: 'Item removed from cart',
        cartItems: carts[sessionId]
    });
});

// POST: Create order
app.post('/api/orders/create', (req, res) => {
    const { customerName, address, phone, items, total } = req.body;
    const sessionId = req.headers['x-session-id'] || 'guest';

    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart is empty'
        });
    }

    const orderId = `FE${orderIdCounter++}`;
    
    const order = {
        orderId: orderId,
        customerName: customerName,
        address: address,
        phone: phone,
        items: items,
        total: total,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        sessionId: sessionId
    };

    orders.push(order);
    
    // Clear the cart after order
    if (carts[sessionId]) {
        carts[sessionId] = [];
    }

    res.json({
        success: true,
        message: 'Order placed successfully',
        orderId: orderId,
        order: order
    });
});

// GET: Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.json({
        success: true,
        order: order
    });
});

// POST: Update order status (admin)
app.post('/api/orders/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    order.status = status;

    res.json({
        success: true,
        message: 'Order status updated',
        order: order
    });
});

// GET: Get orders by customer phone
app.get('/api/orders/customer/:phone', (req, res) => {
    const { phone } = req.params;
    const customerOrders = orders.filter(o => o.phone === phone);

    res.json({
        success: true,
        orders: customerOrders,
        count: customerOrders.length
    });
});

// GET: Get orders by status
app.get('/api/orders/status/:status', (req, res) => {
    const { status } = req.params;
    const statusOrders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());

    res.json({
        success: true,
        orders: statusOrders,
        count: statusOrders.length
    });
});

// GET: Get cart for session
app.get('/api/cart', (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'guest';
    const cart = carts[sessionId] || [];

    res.json({
        success: true,
        cart: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Food Express Server running on http://localhost:${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    console.log('\nEndpoints:');
    console.log('  POST   /api/cart/add              - Add item to cart');
    console.log('  POST   /api/cart/update           - Update item quantity');
    console.log('  POST   /api/cart/remove           - Remove item from cart');
    console.log('  GET    /api/cart                  - Get current cart');
    console.log('  POST   /api/orders/create         - Create new order');
    console.log('  GET    /api/orders                - Get all orders');
    console.log('  GET    /api/orders/:id            - Get order by ID');
    console.log('  GET    /api/orders/customer/:phone - Get orders by phone');
    console.log('  GET    /api/orders/status/:status  - Get orders by status');
    console.log('  POST   /api/orders/:id/status     - Update order status');
    console.log('  GET    /api/health                - Health check');
});

module.exports = app;
