const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const { error } = require("console");
const conn = mongoose.connection;

const Router = express.Router();
// Initialize GridFS stream
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); //setting the name of the  bucket
});

// Create storage using GridFS
const storage = new GridFsStorage({
  url: process.env.DATA_URI, //copied most of this from the documentation
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

Router.post('/upload', upload.single('file'), (req, res, next) => {
  try {
    const db = conn.db;
    const bucket = new mongodb.GridFSBucket(db, { bucketName: "uploads" });
    const uploadStream = bucket.openUploadStream('myFile', {
      chunkSizeBytes: 1048576,
      metadata: { field: 'myField', value: 'myValue' }
    });
    res.send("file uploaded successfully")
  }
  catch (err) {
    console.log(err);
  }

})


module.exports = Router;
