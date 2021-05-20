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
            res.status(500).json({ message: 'Internal Server Error Please Try Again', });
        }
        //else move forward
        else {
            const userExists = data.rows.length;
            if (userExists !== 0) {
                res.status(400).json({ message: 'User Already exists, Try To Login', });
            }
            //If user not exist then add user in database 
            else {
                //creating hash password
                console.log(req.body);
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.log(`Error occured in hashing password\n ${err}`);
                        res.status(500).json({ message: 'Internal Server Error Please Try Again', });
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
                                res.status(500).json({ message: 'Internal Server Error Please Try Again', });
                            } else {
                                console.log('User added successfully');
                                res.status(200).json({
                                    message: `Account Created Successfully`,
                                    dashboardUrl: '/Pages/Dashboard/index.html',
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
            res.status(500).json({ message: 'Internal Server Error Please Try Again', });
        }
        //else move forward
        else {
            const userExists = data.rows.length;
            if (userExists == 0) {
                res.status(400).json({ message: 'No Such User Exists Try Registering Yourself', });;
            }
            //If user exist then check credentials
            else {
                //comparing hash password
                bcrypt.compare(password, data.rows[0].password, (err, result) => {
                    if (err) {
                        console.log(`Error occured in comparing password\n ${err}`);
                        res.status(500).json({ message: 'Internal Server Error Please Try Again', });
                    } else {
                        if (!result) {
                            res.status(401).json({ message: 'Invalid User Credentials', });
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
                                dashboardUrl: '/Pages/Dashboard/index.html',
                                userToken: token,
                            })
                        }
                    }
                });
            }
        }
    });
};