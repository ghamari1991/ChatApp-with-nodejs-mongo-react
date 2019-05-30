const AccountModel = require('../model/account.js');
const AdminModel = require('../model/admin.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.js')
console.log('UserController');
module.exports = {
    AdminLogin(req, res) {
        console.log('LOGIN ROUTE POST');
        AdminModel.findOne({ email: req.body.email }, function (err, Account) {
            if (err) {
                console.log("UserController-login (64) ")
                return res.status(422).json({
                    status: false,
                    msg: "خطایی رخ داده است"
                });
            }

            if (Account === null)
                return res.status(401).json({
                    status: false,
                    msg: 'ایمیل یا پسورد وارد شده صحیح نیست'
                });
            bcryptjs.compare(req.body.password, Account.password, (err, status) => {
                if (!status || err) {
                    return res.status(401).json({
                        status: false,
                        msg: 'ایمیل یا پسورد وارد شده صحیح نیست'
                    })
                }
                else {
                    let token = jwt.sign({ Account_id: Account._id }, config.secret);
                    return res.json({
                        status: true,

                        data: {
                            AccountName: Account.AccountName,
                        },
                        apiToken: token
                    })
                }
            });
        });
    },
    isLoggedInAdmin(req, res) {
        AdminModel.findById(req.Account_id, function (err, Account) {
            if (err) {
                return res.status(401).json({
                    msg: 'Failed to authenticate token'
                });
            } else {
                if (Account) {
                    return res.json({
                        success: true,
                        data: {
                            email: Account.email,
                            AccountName: Account.AccountName,

                        }
                    })
                } else {
                    return res.status(401).json({
                        status: false,
                        msg: 'Failed to authenticate token'
                    });
                }
            }
        });
    },
    getUserList(req, res) {
        console.log("getUserList")
        AdminModel.findById(req.Account_id, function (err, admin) {
            if (err) {
                return res.status(401).json({
                    msg: 'Failed to authenticate token'
                });
            } else {
                if (admin) {
                   AccountModel.find({},{ AccountName:1 },(err,users)=>{
                       return res.json({
                             users
                        })
                   })
                } else {
                    return res.status(401).json({
                        status: false,
                        msg: 'Failed to authenticate token'
                    });
                }
            }
        });
    },
    login(req, res) {
        console.log('LOGIN ROUTE POST');
        AccountModel.findOne({ email: req.body.email }, function (err, Account) {
            if (err) {
                console.log("UserController-login (64) ")
                return res.status(422).json({
                    status: false,
                    msg: "خطایی رخ داده است"
                });
            }

            if (Account === null)
                return res.status(401).json({
                    status: false,
                    msg: 'ایمیل یا پسورد وارد شده صحیح نیست'
                });
            bcryptjs.compare(req.body.password, Account.password, (err, status) => {
                if (!status || err) {
                    return res.status(401).json({
                        status: false,
                        msg: 'ایمیل یا پسورد وارد شده صحیح نیست'
                    })
                }
                else {
                    let token = jwt.sign({ Account_id: Account._id }, config.secret);
                    return res.json({
                        status: true,

                        data: {
                            AccountName: Account.AccountName,
                        },
                        apiToken: token
                    })
                }
            });
        });
    },
    isLoggedIn(req, res) {
        AccountModel.findById(req.Account_id, function (err, Account) {
            if (err) {
                return res.status(401).json({
                    msg: 'Failed to authenticate token'
                });
            } else {
                if (Account) {
                    return res.json({
                        success: true,
                        data: {
                            email: Account.email,
                            AccountName: Account.AccountName,

                        }
                    })
                } else {
                    return res.status(401).json({
                        status: false,
                        msg: 'Failed to authenticate token'
                    });
                }
            }
        });
    },

};