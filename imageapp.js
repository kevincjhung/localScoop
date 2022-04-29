const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')



// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    const bytes = crypto.randomBytes(16).toString('hex')
    cb(null, bytes + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');
// can do .array() if you want to upload multiple images

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', upload, (req, res) => {
  if (req.file == undefined) {
    res.render('index', {
      msg: 'Error: No File Selected!'
    });
    return 
  } 
  console.log(req.file)
  // store some info in the database
  res.render('index', {
    msg: 'File Uploaded!',
    file: `uploads/${req.file.filename}`
  });
});


// TO DO:
// express5 
// error handling