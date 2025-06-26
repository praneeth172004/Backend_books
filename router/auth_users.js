const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // [{username: 'user1', password: 'pass123'}]

// Check if the username is valid (not already used)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Check if the username and password match any registered user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    // Create JWT token
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    // Save token in session
    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Your review was deleted successfully" });
    } else {
      return res.status(404).json({ message: "You haven't posted any review for this book" });
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
