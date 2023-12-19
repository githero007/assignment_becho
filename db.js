const mongoose = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const { error } = require("console");
let upload;

const connectToMongo = async () => {
  try {
    mongoose.connect(process.env.DATA_URI);
    console.log("connected to mongo successfully");
    const conn = mongoose.connection;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectToMongo };
