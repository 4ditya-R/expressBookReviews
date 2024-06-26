const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length >0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) =>{
        return (user.username === username && user.password=== password)
    })
    if(validusers.length > 0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Error logging in"})
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access' , { expiresIn : 60 * 60 })

    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User Successfully logged in");
    }else{
        return res.status(208).json({message: "Invalid login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    let reviews = books[isbn].reviews;
    const hasReview = (reviews.hasOwnProperty(username));
    let reqReview = req.query.review;
    reviews[username] = reqReview;
  
    if(reqReview === undefined || reqReview === "") {
      return res.status(400).json({message: "Please add a review."});
    } else {
      let response = ` ${books[isbn].title} by ${username} - ${books[isbn].reviews[username]}`;
      res.send(`${response}`);
    }
  });

regd_users.delete("/auth/review/:isbn", (req,res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    let reviews = books[isbn].reviews;
    const hasReview = (reviews.hasOwnProperty(username));

    let response = `Review for ${books[isbn].title} by ${username} ` 
    if(hasReview){
       let reviewText = ` ${reviews[username]} was deleted successfully `;
       delete reviews[username];
       res.json( response + reviewText);
    }
    else{
        return res.status(400).json({message: `${response} was not found`})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
