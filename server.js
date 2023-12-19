const { connectToMongo } = require("./db");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = require("./routes/routes");
const Grid = require("gridfs-stream");
const mongodb = require("mongodb");
const crypto = require('crypto')
app.set("view engine", "ejs");
app.use(express.json());
connectToMongo();
let conn = mongoose.connection;
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

// Render index.ejs on the homepage
app.get("/", (req, res) => {
    res.render("index");
});

// Handle file upload
app.post("/upload", upload.single("file"), (req, res, next) => {
    //res.redirect('/');
    res.json({ file: req.file }); // Respond with JSON containing uploaded file info
});
app.get("/files", async (req, res) => {
    try {
        let files = await gfs.files.find().toArray();
        if (!files || files.length === 0) {
            return res.status(500).send("internal server error occured");
        }
        console.log(files);
        return res.status(200).send("files are logged successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});
app.get("/:filename", async (req, res) => {
    try {
        const singleFile = await gfs.files.findOne({
            filename: req.params.filename,
        });
        if (!singleFile) {
            return res.status(400).send("some error has occured ");
        }
        return res.status(200).json(singleFile);
    } catch (error) {
        console.log(error);
        res.status(500).send("some internal server error occured regarding the");
    }
});
app.get("/read/:filename", (req, res) => {
    try {
        const db = conn.db;
        const bucket = new mongodb.GridFSBucket(db, { bucketName: "uploads" });
        const cursor = bucket.find({}).forEach((element) => {
            console.log(element);
        });

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(400).send("file nai vetairaxaian ta yr");
    }
});
app.use(router);

app.listen(3000, console.log("server is listening on port 3000"));
