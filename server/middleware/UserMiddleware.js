const { check, validationResult } = require('express-validator/check');
const config=require('../config.js')
const jwt = require('jsonwebtoken');
module.exports = {
    Authentication(req, res, next){
        // console.log(`☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻☻`);
         console.log(`▬▬▬▬▬▬▬▬▬▬ Authentication middleware ▬▬▬▬▬▬▬▬▬▬`);
        let api_token = req.body.api_token || req.params.api_token||null;
        // console.log(api_token);
        if (api_token === null){
            // console.log(`Failed to authenticate token = null`);
            // console.log(`○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○`);
            return res.json({
                status:false,
                msg : 'Failed to authenticate token1'
            });
        }
        else {
            jwt.verify(api_token,config.secret,(err,decode)=>{
                if (err){
                    // console.log(`Failed to authenticate token`);
                    // console.log(`○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○`);
                    // console.log(err);
                    return res.json({
                        status:false,
                        msg:'Failed to authenticate token2'
                    });
                }
                else {
                    if (decode.Account_id === undefined) {
                        return res.json({
                            status:false,
                            msg:'Failed to authenticate token3'
                        });
                    }else {
                        req.Account_id = decode.Account_id;
                        console.log(`Authenticated`);
                        
                        next();
                    }
                }
            })
        }
    },
    validatorMiddleware(){
    return [
        // username must be an email
        check('AccountName').not().isEmpty().withMessage('نام کاربری مشخص نشده'),
        check('AccountName').trim().isLength({ min: 1 }).withMessage('نام کاربری مشخص نشده '),
        check('email').isEmail().withMessage('فرمت ایمیل نامعتبر است'),
        check('AccountName').isLength({ max: 30 }).withMessage('نام کاربری باید از 30 کاراکتر کمتر باشد'),
        // password must be at least 5 chars long
        check('password').isLength({ min: 8 }).withMessage('کلمه عبور بایستی بیش از 8 کاراکتر باشد'),
        this.validationMiddleware
    ]
},
    validationMiddleware(req, res, next){
    console.log('*******************\nCHECK REGISTER FORM');
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('REGISTER FORM INVALID\n*******************');
        return res.status(422).json({
            status:false,
            msg: errors.array().map(field=>field.msg)
        });
    }
    next();
},
  
 
 
    
};