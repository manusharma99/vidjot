const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

module.exports =router;
//login route
router.get('/login',(req,res)=>{
    res.render('users/login');
});
//user register route
router.get('/register',(req,res)=>{
       res.render('users/register');
});

