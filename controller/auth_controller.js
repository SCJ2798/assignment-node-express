// 
const { Router } = require("express");
const UserRepository = require('../repository/user_repository');
const app = Router();

app.post('/login',async (req,res,next) => {
    try {
        const {email,password} = req.body;
        const result = await UserRepository.loginUser({
            email:email,
            password:password
        });
        res.status(200).json({
            msg:"DONE",
            data:result
        });
    } catch (error) {
        next(error);
    }
});

app.post('/signup',async (req,res,next) => {
    try {
        const {first_name,last_name,email,password} = req.body;
        const result = await UserRepository.registerUser({
            first_name,
            last_name,
            email,
            password,
        });
        res.status(200).json({
            msg:"DONE",
            data:result
    });
    } catch (error) {
        next(error);
    }
});


module.exports = app;