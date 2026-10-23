# 🍔 Food Express - Online Food Ordering System

A complete full-stack online food ordering application with front-end and back-end cart functionality.

## Features

### Frontend (APP.HTML)
✅ **Add to Cart** - Click to add items with instant feedback
✅ **Quantity Management** - Increase/decrease quantities with +/- buttons
✅ **Remove Items** - Remove individual items from cart
✅ **Clear Cart** - Clear entire cart with confirmation
✅ **Local Storage** - Cart persists even after page refresh
✅ **Search Functionality** - Filter foods by name
✅ **Responsive Design** - Works on all devices
✅ **Real-time Total** - Automatically calculates total price

### Backend (server.js)
✅ **Cart Management** - Add, update, remove items from cart
✅ **Order Processing** - Create and track orders
✅ **Order History** - View all orders and individual order details
✅ **Status Updates** - Update order status (Pending, Preparing, Ready, Delivered)
✅ **RESTful API** - Clean API endpoints for all operations
✅ **CORS Enabled** - Works with frontend from any origin

## Project Structure

```
ONLINE FOOD/
├── APP.HTML          # Frontend - Main application
├── server.js         # Backend - Express server
├── package.json      # Node.js dependencies
└── README.md         # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Food Express Server running on http://localhost:5000
   ```

### Frontend Setup

1. **Open the HTML file**
   - Double-click `APP.HTML` in your file explorer, or
   - Open it in your web browser by dragging it to the browser window

2. **Make sure the backend is running** (see Backend Setup above)

## API Endpoints

### Cart Operations

**Add Item to Cart**
```
POST /api/cart/add
Content-Type: application/json

{
  "item": "Pizza",
  "price": 199,
  "quantity": 1
}
```

**Update Item Quantity**
```
POST /api/cart/update
Content-Type: application/json

{
  "id": 1234567890,
  "quantity": 2
}
```

**Remove Item from Cart**
```
POST /api/cart/remove
Content-Type: application/json

{
  "id": 1234567890
}
```

**Get Current Cart**
```
GET /api/cart
```

### Order Operations

**Create New Order**
```
POST /api/orders/create
Content-Type: application/json

{
  "customerName": "John Doe",
  "address": "123 Street, City",
  "phone": "9876543210",
  "items": [
    {
      "id": 1234567890,
      "name": "Pizza",
      "price": 199,
      "quantity": 1,
      "emoji": "🍕"
    }
  ],
  "total": "199"
}
```

**Get All Orders**
```
GET /api/orders
```

**Get Order by ID**
```
GET /api/orders/FE1000
```

**Update Order Status**
```
POST /api/orders/FE1000/status
Content-Type: application/json

{
  "status": "Preparing"
}
```

**Health Check**
```
GET /api/health
```

## How to Use

### Adding Items to Cart

1. Browse the food menu in the frontend
2. Click **"Add to Cart"** button on any item
3. You'll see a confirmation message
4. The item appears in the shopping cart section below

### Managing Cart

1. **Increase Quantity** - Click the **+** button
2. **Decrease Quantity** - Click the **-** button
3. **Remove Item** - Click the **Remove** button
4. **Clear All** - Click the **Clear Cart** button

### Placing an Order

1. Fill in your details:
   - Customer Name
   - Address
   - Phone Number
2. Click **"Place Order"** button
3. Order is sent to backend and cart is cleared
4. You'll see a confirmation with Order ID

### Checking Cart Persistence

1. Add items to cart
2. Refresh the browser page
3. Your cart items are still there (saved in browser storage)

## Storage Details

- **Frontend**: Uses browser `localStorage` to persist cart data
- **Backend**: Uses in-memory storage (data is cleared on server restart)
- **For Production**: Replace with MongoDB, PostgreSQL, or Firebase

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication & accounts
- [ ] Payment gateway integration
- [ ] Order tracking with real-time updates
- [ ] Admin dashboard
- [ ] Restaurant management
- [ ] Delivery partner integration
- [ ] Reviews & ratings

## Troubleshooting

### Backend won't connect
- Make sure the server is running on `http://localhost:5000`
- Check if port 5000 is not blocked by firewall
- Restart the server: Press Ctrl+C and run `npm start` again

### Cart not persisting
- Clear browser cache and cookies
- Use a different browser
- Check if localStorage is enabled in browser

### Port 5000 already in use
- Find the process using port 5000 and kill it, or
- Change the port in server.js: `const PORT = 3000;`

## Contact & Support

For issues or feature requests, please contact the development team.

---

**Happy Ordering! 🍽️**
