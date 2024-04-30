const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.params.username;
  const password = req.params.password;
  if(username && password){
    if( !isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User succesfully registered. Now you can log in "})
    }
    else{
        return res.status(200).json({message:"User already exists"});     
    }
  } 
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null , 4));
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
//    res.send(books[isbn]);
   return res.status(200).json({message: books[isbn]});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    res.send(JSON.stringify(books[author]));
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    res.send(books[title]);
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const review = req.params.review;
    res.send(books[review]);
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
