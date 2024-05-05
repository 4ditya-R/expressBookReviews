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
  return res.status(404).json({message: "Unable to register user. Provide username and / or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json({Message: books});
});


public_users.get('/isbn/:isbn', function (req, res) {

    const reqIsbn = req.params.isbn;

    getBooksByIsbn(reqIsbn)
        .then(booksByIsbn =>{
            res.json({"Books by ISBN ": booksByIsbn });
        })
        .catch(error =>{
            console.error("Error occured " + error);
            res.status(500).json({Error : "Internal server error"})
        })
    });

function getBooksByIsbn(reqIsbn) {
    return new Promise((resolve,reject)=>{
        const booksByIsbn = [];

        for (const key in books) {
            if (books.hasOwnProperty(key)) {
                const book = books[key];
                if (book.isbn === reqIsbn) {
                    booksByIsbn.push(book);
                }
            }
        }
        resolve(booksByIsbn);
    })
}
  
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
    const reqIsbn = req.params.isbn;
    res.send(JSON.stringify(books[reqIsbn].reviews,null,4));
});

module.exports.general = public_users;
