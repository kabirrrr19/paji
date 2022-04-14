const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
// const { resolveSoa } = require('dns');
const app = express();

dotenv.config({
    path:'./.env'
})

const db = mysql.createConnection({
    host : process.env.DATABASE_HOST, // ip address of your server
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

//link for externa files files for frontend like css or js
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.static('views/images')); 

//Parse URL-encoded bodies (as sent by the forms)
app.use(express.urlencoded({extended : false}));
//Parse JSON bodies (as sent by the API clients)
app.use(express.json());

app.use(cookieParser()); 


app.set('view engine', 'hbs');


db.connect( (err) => {
    if (err) {
        console.log("There is an error : " + err.message);
    }
    else{
        console.log('mysql Connected');
    }   
})


// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
// whatever starts with auth we go requiring ./routes/auth
// jaha /auth ho vaha ./routes/auth chahiye


app.listen(3000, (req, res) => {
    console.log('server started on port 3000');
});