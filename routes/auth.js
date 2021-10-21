

const express = require('express');
const authController = require('../controller/auth')

//like 'auth/register' auth because its coming from the other page and we finish with /register
const router = express.Router();
router.post('/register', authController.register)
// we grab router.post from register we're gonna load the auth controller and call register

router.post('/login', authController.login)



module.exports = router;


// Ye alag se banaya hai routes me post request ko lene ke liye register se