var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var imgSchema = require('./model.js');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
require('dotenv').config();

// Set view engine
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Multer setup for file upload
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage });

// Route to display the upload form and uploaded data
app.get('/', (req, res) => {
    imgSchema.find({})
        .then((data) => {
            res.render('imagepage', { items: data });
        })
        .catch((err) => {
            console.log(err);
        });
});

// Route to handle form submission and image upload
app.post('/', upload.single('image'), (req, res, next) => {
    var obj = {
        name: req.body.name,
        age: req.body.age,
        salary: req.body.salary,
        jadagam: req.body.jadagam,
        gender: req.body.gender,
        profession: req.body.profession,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    };

    imgSchema.create(obj)
        .then((item) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error uploading image.");
        });
});

// Server start
app.listen(4000,'0.0.0.0', () => {
    console.log('Server started on http://localhost:3000');
});
