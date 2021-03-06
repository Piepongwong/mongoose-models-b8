const express = require("express");
const app = express();
const Movie = require("./models/Movie");
const createError = require('http-errors')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

var session = require('express-session')
var sessionOptions = {
    secret: 'keyboard cat', // don't change it for now. This decides how your sid is going to be created
    cookie: {}
  }
  
app.use(session(sessionOptions));

app.set('views', './views');
app.set('view engine', 'hbs');

const mongoose = require("mongoose");

let options = { 
                useNewUrlParser: true,  
                useUnifiedTopology: true 
            };

mongoose.connect("mongodb://localhost:27017/video", options ,(err, connectionInfo)=> {
    if(err) console.log("ERROR", err);
    else console.log("connected to db");
})
// some useless middleware to demonstrate the concept
app.use("/", (req,res, next)=> {
    console.log("HI I'm part of some middleware");
    next();
})
// protection middleware. If the user isn't logged in, redirect. If the user IS logged in proceed tot the next route/middleware
function protect(req,res, next) {
    if(req.session.currentUser) next();
    else next(createError(401, 'Please login to view this page.'));
}

//app.use("/", require("./routes/home"));
app.use("/movies", protect)
app.use("/directors", protect )
app.use("/movies", require("./routes/movies"));
app.use("/user", require("./routes/user"));

app.use("/", (req,res,next)=> {
    next(createError(404, "Page not found."))
})

app.use((err, req, res, next)=> {
    console.log(err)
    res.render("error", err)
})

app.listen(3000,()=> {
    console.log("Webserver listening");
})
