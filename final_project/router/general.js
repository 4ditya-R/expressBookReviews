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

    const getBooksByIsbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
            if (req.params.isbn) {
            resolve(res.send(books[isbn]));
        }
            else {
                reject(res.send('ISBN not found'));
            }
        });
        getBooksByIsbn.
            then(function(){
                console.log("Promise for Task 11 has been resolved");
       }).
            catch(function () { 
                    console.log('ISBN not found');
      });    
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {


    const get_books_author = new Promise((resolve, reject) => {

        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksbytitle.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
          }
    
    
        });
        reject(res.send("The mentioned author does not exist "))
            
        });
    
        get_books_author.then(function(){
                console.log("Promise is resolved");
       }).catch(function () { 
                    console.log('The mentioned author does not exist');
      }); 
      });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {


    const get_books_title = new Promise((resolve, reject) => {

        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
          }
    
    
        });
        reject(res.send("The mentioned author does not exist "))
            
        });
    
        get_books_title.then(function(){
                console.log("Promise is resolved");
       }).catch(function () { 
                    console.log('The mentioned author does not exist');
      });
    
      });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const reqIsbn = req.params.isbn;
    res.send(JSON.stringify(books[reqIsbn].reviews,null,4));
});

module.exports.general = public_users;
