const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
var data = Object.values(books);

const isValid = (username)=>{ 
    if(!username)
    {
        return false;
    }
    else{
        return true;
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
      
        if (!username || !password) {
            return res.status(404).json({message: "Error logging in"});
        }
       if (authenticatedUser(username,password)) {
          const accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60 * 60 });
      
          req.session.authorization = {
            accessToken
        }
        return res.status(200).send("User successfully logged in");
        } else {
          return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    //books[isbn].review.user = info;
    books[isbn].review = review;
    res.send("the book with the isbn " + isbn + " has a new review");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
