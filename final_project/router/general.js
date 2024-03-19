const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

var data = Object.values(books);
public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    const doesExist = (username)=>{
        let userswithsamename = users.filter((user)=>{
          return user.username === username
        });
        if(userswithsamename.length > 0){
          return true;
        } else {
          return false;
        }
      }
    if(username && password){
        if(!doesExist(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "user successfully registered! you can now login"})
        }
        else{
            return res.status(404).json({message: "user already exists!"})
        }
    }
    return res.status(404).json({message: "unable to register user."})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});
function sendBooksData() {
    return new Promise((resolve, reject) => {
      public_users.get('/', function (req, res) {
        try {
          res.send(books);
          resolve('Books data sent successfully'); // Resolve the promise
        } catch (error) {
          reject(error); // Reject the promise if there's an error
        }
      });
    });
  }
  
  // Call the function and handle promise resolution and rejection
  sendBooksData()
    .then(message => {
      console.log(message); // Logs 'Books data sent successfully' if successful
    })
    .catch(error => {
      console.error(error); // Logs the error if there's any
    });
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn]);
 });
// Assuming books is already defined

// Define a function that returns a promise to retrieve book data by ISBN
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      if (books.hasOwnProperty(isbn)) {
        resolve(books[isbn]); // Resolve the promise with the book data
      } else {
        reject('Book not found'); // Reject the promise if the book is not found
      }
    });
  }
  
  // Route to handle requests for retrieving book data by ISBN
  public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Call the function to retrieve book data by ISBN and handle promise resolution
    getBookByISBN(isbn)
      .then(bookData => {
        res.send(bookData); // Send the book data as response
      })
      .catch(error => {
        res.status(404).send(error); // Send 404 error response if book is not found
      });
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered = data.filter((user)=> user.author === author);
    res.send(filtered);
});

// Define a function that returns a promise to filter data based on author
function filterDataByAuthor(author) {
    return new Promise((resolve, reject) => {
      let filtered = data.filter(user => user.author === author);
      resolve(filtered); // Resolve the promise with the filtered data
    });
  }
  
  // Route to handle requests for filtering data by author
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Call the function to filter data by author and handle promise resolution
    filterDataByAuthor(author)
      .then(filteredData => {
        res.send(filteredData); // Send the filtered data as response
      })
      .catch(error => {
        res.status(500).send('Error filtering data by author'); // Send error response if filtering fails
      });
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered = data.filter((user)=> user.title === title);
    res.send(filtered);
});
// Assuming data is already defined

// Define a function that returns a promise to filter data based on title
function filterDataByTitle(title) {
    return new Promise((resolve, reject) => {
      let filtered = data.filter(user => user.title === title);
      resolve(filtered); // Resolve the promise with the filtered data
    });
  }
  
  // Route to handle requests for filtering data by title
  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Call the function to filter data by title and handle promise resolution
    filterDataByTitle(title)
      .then(filteredData => {
        res.send(filteredData); // Send the filtered data as response
      })
      .catch(error => {
        res.status(500).send('Error filtering data by title'); // Send error response if filtering fails
      });
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let dat = books[isbn];
    let filt = dat["reviews"];
    res.send(filt);
});

module.exports.general = public_users;
