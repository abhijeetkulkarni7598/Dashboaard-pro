const express = require("express");
const User = require("../models/User");
const upload = require("../controller/multer");
const authMiddleware = require("../middleware/authMiddleware")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
    try {
      console.log('Fetching users from the database...');
      const users = await User.find();
      console.log('Users fetched:', users);
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
  });

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id); // Assume User is your user model
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user details" });
    }
  });
  

router.post("/add-friend/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Ensure `req.user` is defined by using the middleware
      const user = await User.findById(req.user._id);
      const friend = await User.findById(id);
  
      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }
  
      // Check if the friend is already in the user's friend list
      if (user.friends.includes(friend._id)) {
        return res.status(400).json({ message: "Friend already added" });
      }
  
      // Add friend and activity log
      user.friends.push(friend._id);
      user.activities.push({
        action: `Added ${friend.name} as a friend.`,
        timestamp: new Date(),
      });
  
      await user.save();
      res.status(200).json({ message: "Friend added successfully" });
    } catch (error) {
      console.error("Error adding friend:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

router.patch(
    "/update-profile",
    authMiddleware,
    upload.single("profilePicture"),
    async (req, res) => {
      try {
        const userId = req.user._id;
        const {
          name,
          email,
          password,
        } = req.body;
  
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Update name and email if provided
        if (name) user.name = name;
        if (email) user.email = email;
  
        // Update password if provided and hash it
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }
  
        // Update profile picture if uploaded
        if (req.file) {
          user.profilePicture = req.file.path;
        }

  
        // Save updated user
        await user.save();
  
        res.status(200).json({
          message: "Profile updated successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
          },
        });

        user.activities.push({
          action: `profile updated.`,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
  
  
/*router.post("/update-profile", upload.single("profilePicture"), async (req, res) => {
    const user = await User.findById(req.user.id);
    if (req.file) user.profilePicture = req.file.path;
    
    user.activities.push({
      action: "Updated profile",
      timestamp: new Date(),
    });
    
    await user.save();
    
    res.json(user);
  });
  */

module.exports = router;
