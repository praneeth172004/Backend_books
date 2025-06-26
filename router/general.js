const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = 'https://sunnypraneet-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

// ----------- Task 1: Register a new user --------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// ----------- Task 2: Get the book list available in the shop --------------
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// ----------- Task 3: Get book details based on ISBN --------------
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ----------- Task 4: Get book details based on author --------------
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// ----------- Task 5: Get all books based on title --------------
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// ----------- Task 6: Get book reviews by ISBN --------------
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ----------- Task 10: Get all books (using async/await with Axios) --------------
public_users.get('/books-async', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books list", error: err.message });
  }
});

// ----------- Task 11: Get book by ISBN (using Promise + Axios) --------------
public_users.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(err => res.status(404).json({ message: "Book not found", error: err.message }));
});

// ----------- Task 12: Get books by author (using async/await + Axios) --------------
public_users.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "Author not found", error: err.message });
  }
});

// ----------- Task 13: Get books by title (using Promise + Axios) --------------
public_users.get('/books/title/:title', (req, res) => {
  const { title } = req.params;
  axios.get(`${BASE_URL}/title/${title}`)
    .then(response => res.status(200).json(response.data))
    .catch(err => res.status(404).json({ message: "Title not found", error: err.message }));
});


module.exports.general = public_users;
