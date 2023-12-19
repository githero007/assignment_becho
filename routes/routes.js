const express = require("express");
const router = express.Router();
const handleSignUp = require("../controllers/signUpController");
const handleLogin = require("../controllers/loginController");
const handleDelete = require("../controllers/deleteController");
const handlePdfUpload = require("../controllers/pdfController");
const { body } = require("express-validator");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(
    [
      body("name", "name must have atleast 3 characters").isLength({ min: 3 }),
      body("email", "please enter a valid email").isEmail(),
      body("password", "please enter a valid password").isLength({ min: 3 }),
    ],
    handleSignUp
  )
  .post(
    [
      body("email", "please enter a valid email").isEmail(),
      body("password", "please 0enter a valid password").isLength({ min: 3 }),
    ],
    handleLogin
  )
  .delete(verifyJWT, handleDelete);
module.exports = router;
