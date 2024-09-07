const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes
// Create a new user
router.post("/", userController.createUser); // POST /api/users/

// Get all users
router.get("/", userController.getUsers); // GET /api/users/

// Get user by ID
router.get("/:id", userController.getUserById); // GET /api/users/:id

// Update a user
router.put("/:id", userController.updateUser); // PUT /api/users/:id

// Delete a user
router.delete("/:id", userController.deleteUser); // DELETE /api/users/:id

module.exports = router;
