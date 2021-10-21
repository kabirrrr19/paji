const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('register');
});

// THIS EXTRA ROUTE IS ADDED TO ACCESS INDEX PAGE FROM REGISTER PAGE AND LOGIN PAGE
router.get('/index', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;