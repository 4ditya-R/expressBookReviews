const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

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
  return res.status(300).json({Message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const reqIsbn = req.params.isbn;
  const bookNum = [];

  for (const key in books){
    if(books.hasOwnProperty(key)){
        if(key === reqIsbn){
            const book = books[key];
            bookNum.push(book);
        }
    }
  }
    res.json({"Books by ISBN" : bookNum});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   let reqAuthor = req.params.author;
   let authVal = [];

       for ( const key in books){
        if(books.hasOwnProperty(key)){
            const book = books[key];
            if(book.author === reqAuthor){
                authVal.push(book);
            }
        }   
       }
       res.json({'Books By Author': authVal});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const reqTitle = req.params.title;
    const titles = [];
    
    for (const key in books) {
        if (books.hasOwnProperty(key)) {
            const book = books[key];
            if (book.title ===reqTitle ) {
                titles.push(book);
            }
        }
    }  
    res.json({ "Books by Title": titles});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const reqReview = req.params.review;
    const reviews = [];
    
    for(const key in books){
        if( books.hasOwnProperty(key)){
            const book = books[key];
            if(book.review === reqReview){
                reviews.push(book.review);
            }
            else
            {
                res.json("No reviews")
            }
        }
    } 
    res.json({Reviews: reviews});
});

module.exports.general = public_users;
