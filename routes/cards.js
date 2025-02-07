app.get("/api/cart", async (req, res) => {
    try {
      const cartItems = await Cart.find();
      res.json(cartItems);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add an item to the cart
  app.post("/api/cart", async (req, res) => {
    const { id, name, price, quantity } = req.body;
  
    try {
      const existingItem = await Cart.findOne({ id });
  
      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
      } else {
        const newItem = new Cart({ id, name, price, quantity });
        await newItem.save();
      }
  
      const updatedCart = await Cart.find();
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json({ message: "Error adding item" });
    }
  });
  
  // Remove an item from the cart
  app.delete("/api/cart/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await Cart.deleteOne({ id });
      const updatedCart = await Cart.find();
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json({ message: "Error deleting item" });
    }
  });
  