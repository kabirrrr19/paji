const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host : process.env.DATABASE_HOST, // ip address of your server
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

// FOR LOGIN
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if ( !password && !email ) {
            return res.status(400).render('login', { 
                message : 'Please provide an email and a password'
            })
        }
        else if ( !email ) {
            return res.status(400).render('login', { 
                message : 'Please provide an email'
            })
        }
        else if ( !password ) {
            return res.status(400).render('login', { 
                message : 'Please provide a password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
                                                    // results[0] means the first result and can access its values
            if ( !results || !(await bcrypt.compare(password, results[0].password) ) ) {
                
                res.status(400).render('login', {
                    message : 'The Email or the password is incorrect'
                });

            }
            else {

                const id = results[0].id;
                                // { id: id } shortened as { id }
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn : process.env.JWT_EXPIRES_IN
                });

                console.log("The token is : " + token);

                const cookieOptions = {
                    express : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly : true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).render('index');

            }

        })
        


    } catch (error) {
        console.error(error);
    }
}


// FOR REGISTER
exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.username;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.confirmpassword;

    // TO AVOID SQL INJECTION
    //Destructuring
    
    const { username, email, password, confirmPassword} = req.body;
    console.log(username, email, password, confirmPassword);
    db.query('SELECT EMAIL FROM USERS WHERE EMAIL = ?', [email], async(error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            console.log(results.length);
            return res.render('register', { 
                message: 'That email is already in use'
            })
        } else if ( password !== confirmPassword) {
            console.log(password, confirmPassword);
            return res.render('register', { 
                message: 'The passwords do not match'
            });
        }

         let hashedPassword = await bcrypt.hash(password, 8);
         console.log(hashedPassword);
        //  res.send('testing');

        db.query('INSERT INTO users SET ?', {name:username, email:email, password:hashedPassword }, (error, results) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(results);
                return res.render('login', { 
                    message: 'You have been successfully registered. You can login now.'
                });
            }
        })
    });
}