const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const user = require('../models/user');
const { body, validationResult } = require('express-validator');
const salt = bcrypt.genSaltSync(10);
const handleSignUp = async(req,res) =>{
    console.log("signup Controller")
    const result = validationResult(req);
    try{
    if(!result.isEmpty()){
        return res.status(400).json({ errors: result.array() });;
    }
    else {
        let newUser = await user.findOne({email:req.body.email}) //syntax for finding and returning one element
        if (newUser){ return res.status(400).send("user with this email already exists");}  
        const encryptedPassword = await  bcrypt.hash(req.body.password,salt);
        newUser = new user({
            name:req.body.name,
            email : req.body.email,
            password : encryptedPassword,
            education : req.body.education,
            userId : uuidv4()

        })
        await newUser.save();
        res.send(newUser.name);
        
    }}
    catch(err){
        console.error(err);
    }


}
module.exports = handleSignUp;
