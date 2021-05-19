const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../configs/db');

//creating a sign up method 
exports.signUp = (req, res) => {
    const { name, email, password } = req.body;
    //checking if a user already exist with given email id
    client.query(`SELECT * FROM users WHERE email = '${email}'`, (err, data) => {
        //if error occured
        if (err) {
            console.log(`Error occured in searching users\n ${err}`);
            res.status(500).send('Internal Server Error');
        }
        //else move forward
        else {
            const userExists = data.rows.length;
            if (userExists !== 0) {
                res.status(400).send('User already exists');
            }
            //If user not exist then add user in database 
            else {
                //creating hash password
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.log(`Error occured in hashing password\n ${err}`);
                        res.status(500).send('Internal Error Please try again');
                    } else {
                        //creating token for each user
                        const token = jwt.sign({
                                name: name,
                                email: email,
                            },
                            process.env.SECRET_KEY,
                        );
                        //finally adding user to database
                        client.query(`INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hash}'); `, (err) => {
                            if (err) {
                                console.log(`Error occured in adding users\n ${err}`);
                                res.status(500).send('Internal Database Error Please Try Again');
                            } else {
                                console.log('User added successfully');
                                res.status(200).json({
                                    message: 'User added successfully',
                                    userToken: token,
                                });
                            }
                        });
                    }
                });
            }
        }
    });
};

//siginig a valid user 
exports.login = (req, res) => {
    const { email, password } = req.body;
    //checking if a user already exist with given email id
    client.query(`SELECT * FROM users WHERE email = '${email}'`, (err, data) => {
        //if error occured
        if (err) {
            console.log(`Error occured in searching users\n ${err}`);
            res.status(500).send('Internal Server Error');
        }
        //else move forward
        else {
            const userExists = data.rows.length;
            if (userExists == 0) {
                res.status(400).send('No User exists try registering yourself');
            }
            //If user exist then check credentials
            else {
                //comparing hash password
                bcrypt.compare(password, data.rows[0].password, (err, result) => {
                    if (err) {
                        console.log(`Error occured in comparing password\n ${err}`);
                        res.status(500).send('Internal Error Please try again');
                    } else {
                        if (!result) {
                            res.status(403).send('Incorrect User Credentials');
                        } else {
                            //creating token for user
                            const token = jwt.sign({
                                    name: data.rows[0].name,
                                    email: email,
                                },
                                process.env.SECRET_KEY,
                            );
                            //finally logging in the user
                            res.status(200).json({
                                message: 'User Logged in successfully',
                                dashboardUrl: '../../Note-Making-Frontend/Pages/Dashboard/index.html',
                                userToken: token,
                            })
                        }
                    }
                });
            }
        }
    });
};