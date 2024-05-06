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
    const bookList = new Promise((resolve,reject)=>{
        resolve(res.status(300).json({Message: books}));
    })
    bookList.
    then(function(){
        console.log("Promise for Task 10 has been resolved");
    }).
    catch(function(){
        console.log("Book list not found")
    })
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


    const booksByAuth = new Promise((resolve, reject) => {

        let booksByAuthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksByAuthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "author":books[isbn]["author"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksByAuthor}, null, 4)));
          }
    
    
        });
        reject(res.send("The mentioned author does not exist "))
            
        });
    
        booksByAuth.then(function(){
                console.log("Promise for Task 12 has been resolved");
       }).catch(function () { 
                    console.log('The mentioned author does not exist');
      }); 
      });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {


    const booksbytitle = new Promise((resolve, reject) => {

        let booksByTitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["title"] === req.params.title) {
            booksByTitle.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "author":books[isbn]["author"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksByTitle}, null, 4)));
          }
    
    
        });
        reject(res.send("The mentioned title does not exist "))
            
        });
    
        booksbytitle.then(function(){
                console.log("Promise for Task 13 has been resolved");
       }).catch(function () { 
                    console.log('The mentioned title does not exist');
      });
    
      });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const reqIsbn = req.params.isbn;
    res.send(JSON.stringify(books[reqIsbn].reviews,null,4));
});

module.exports.general = public_users;
