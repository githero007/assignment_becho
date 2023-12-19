const express = require('express');
const router = express.Router();
const user = require('../models/user')
const handleDelete = async (req,res)=>{
     try{
         const {email} =  req.body.email;
         const result  = await user.deleteOne({email});
         res.send("user deleted successfully")
     }
     catch(error){
          res.status(500).send("something went wrong please try again");
          console.log(error);
     }
}
module.exports = handleDelete