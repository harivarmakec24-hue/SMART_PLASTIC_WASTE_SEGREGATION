## 🚀 Quick Start Guide

### Step 1: Install Backend Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

Expected output:
```
🚀 Food Express Server running on http://localhost:5000
```

### Step 3: Open the Frontend
- Double-click `APP.HTML` to open in your browser
- Or open file explorer → Right-click APP.HTML → Open with Browser

### Step 4: Test Add to Cart
1. Click "Add to Cart" button on any food item
2. You should see a confirmation popup
3. Check the **Shopping Cart** section to see your items
4. Test quantity buttons (+/-)
5. Refresh page to verify cart persists

### Step 5: Place an Order
1. Fill in customer details (Name, Address, Phone)
2. Click "Place Order"
3. Order is sent to backend and cart clears

---

## Testing API Endpoints (Using Postman/cURL)

### Test 1: Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"item":"Pizza","price":199,"quantity":1}'
```

### Test 2: Get Cart
```bash
curl http://localhost:5000/api/cart
```

### Test 3: Create Order
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerName":"John Doe",
    "address":"123 Main St",
    "phone":"9876543210",
    "items":[{"name":"Pizza","price":199,"quantity":1}],
    "total":"199"
  }'
```

### Test 4: Get All Orders
```bash
curl http://localhost:5000/api/orders
```

---

## Features Implemented

### Frontend
- ✅ Add items to cart
- ✅ Increase/decrease quantities
- ✅ Remove individual items
- ✅ Clear entire cart
- ✅ Local storage persistence
- ✅ Search filter
- ✅ Real-time total calculation
- ✅ Order placement form

### Backend
- ✅ Cart management API
- ✅ Order creation & storage
- ✅ Order tracking
- ✅ Status management
- ✅ Session-based cart isolation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/cart" | Make sure backend is running on port 5000 |
| Node not found | Install Node.js from nodejs.org |
| Port 5000 in use | Change port in server.js or kill the process |
| Cart not saving | Enable localStorage in browser settings |
| CORS error | Backend has CORS enabled, check frontend URL |

---

**Need help? Check README.md for detailed documentation!**
