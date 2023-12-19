const express = require('express');

require('dotenv').config();
const bcrypt = require('bcrypt');
const router = express.Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const handleLogin = async ( req,res)=>{
    console.log("login controller");
    const result = validationResult(req);
    if(!result.isEmpty())
    {
        return res.status(200).json({error:"some error has occured"})
    }
    const userWithSameEmail = await user.findOne({email:req.body.email})
    if(!userWithSameEmail)
    {
      return  res.status(400).send("user with this email doesnot exist");
    }
  const loggedUser = await   bcrypt.compareSync(req.body.password,userWithSameEmail.password);
  if(!loggedUser)
  {
    return res.status(400).send("invalid password please enter the correct one");
  }
  const payload = {
    name  : userWithSameEmail.name,
    email : userWithSameEmail.email,
    education : userWithSameEmail.education,
    userId : userWithSameEmail.userId

};
 const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); 
 res.status(200).json({accesstoken : accessToken})
}

module.exports = handleLogin