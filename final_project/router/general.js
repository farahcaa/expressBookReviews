const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

var data = Object.values(books);
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!doesExitst(username)){
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

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered = data.filter((user)=> user.author === author);
    res.send(filtered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered = data.filter((user)=> user.title === title);
    res.send(filtered);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let dat = books[isbn];
    let filt = dat["reviews"];
    res.send(filt);
});

module.exports.general = public_users;
