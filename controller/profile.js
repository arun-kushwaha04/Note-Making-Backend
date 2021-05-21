const client = require('../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.userData = (req, res) => {
    res.send(200).json({
        message: "User Data Reterived Successfully",
        name: req.name,
        email: req.email,
    });
}

exports.updateEmail = (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    client.query(`SELECT * FROM users WHERE email = '${req.email}'`, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            const hashPassword = data.password;
            bcrypt.compare(userPassword, hashPassword, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Internal Server Error", });
                } else {
                    if (!result) {
                        res.status(400).json({ message: "Invalid password", });
                    } else {
                        client.query(`UPDATE users SET email='${userEmail}' WHERE email='${req.email}'`, err => {
                            if (err) {
                                res.status(500).json({ message: "Internal Server Error", });
                            } else {
                                req.email = userEmail;
                                const token = jwt.sign({
                                        name: data.name,
                                        email: req.email,
                                    },
                                    process.env.SECRET_KEY,
                                );
                                res.status(200).json({
                                    message: "Email Updated successfully",
                                    userToken: token,
                                });
                            }
                        })
                    }
                }
            });
        }
    })
}

exports.updateName = (req, res) => {
    const userName = req.body.name;
    const userPassword = req.body.password;
    client.query(`SELECT * FROM users WHERE email = '${req.email}'`, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            const hashPassword = data.password;
            bcrypt.compare(userPassword, hashPassword, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Internal Server Error", });
                } else {
                    if (!result) {
                        res.status(400).json({ message: "Invalid password", });
                    } else {
                        client.query(`UPDATE users SET name='${userName}' WHERE email='${req.email}'`, err => {
                            if (err) {
                                res.status(500).json({ message: "Internal Server Error", });
                            } else {
                                req.name = userName;
                                const token = jwt.sign({
                                        name: userName,
                                        email: data.email,
                                    },
                                    process.env.SECRET_KEY,
                                );
                                res.status(200).json({
                                    message: "Name Updated successfully",
                                    userToken: token,
                                });
                            }
                        })
                    }
                }
            });
        }
    })
}

exports.updatePassword = (req, res) => {
    const userNewPassword = req.body.newPassword;
    const userPassword = req.body.password;
    client.query(`SELECT * FROM users WHERE email = '${req.email}'`, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", });
        } else {
            const hashPassword = data.password;
            bcrypt.compare(userPassword, hashPassword, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Internal Server Error", });
                } else {
                    if (!result) {
                        res.status(400).json({ message: "Invalid password", });
                    } else {
                        bcrypt.hash(userNewPassword, 10, (err, hash) => {
                            if (err) {
                                console.log(`Error occured in hashing password\n ${err}`);
                                res.status(500).json({ message: 'Internal Server Error Please Try Again', });
                            } else {
                                client.query(`UPDATE users SET password='${hash}' WHERE email='${req.email}'`, err => {
                                    if (err) {
                                        res.status(500).json({ message: "Internal Server Error", });
                                    } else {
                                        res.status(200).json({
                                            message: "Password Updated successfully",
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    })
}