// require 
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();

const axios = require('axios');
const { append } = require("express/lib/response");

const app = express();
app.use(express.json())




// const path = require('path')  is for app.use(express.static())



/* Global Variables */



// GET /shop_setup/a
router.get("/a", (req, res) => {
   let expShopProfilePhotoFilename = db.getShopProfilePhotoFilename(101);
    
   // res.render("index", {

    // })
})



// GET /shop_setUp/shop_setUp_1
router.get("/shop_setUp_1", (req, res) => {
    res.render("shop_setup/shop_setup_1", {

    })
})

// GET /shop_setUp/shop_setUp_2
router.get("/shop_setup_2", (req, res) => {
    res.render("shop_setup/shop_setup_2", {

    })
})

// POST /shop_setUp/shop_setUp_2
router.post("/shop_setup_2", (req, res) => {
  // let doesShopExist = db.doesShopExist("Les Basics")
  
  // console.log(req.body)

  db.addShop(req.body)

  res.redirect("/shop_setup/shop_setup_3")
})

// GET /shop_setUp/shop_setUp_3
router.get("/shop_setup_3", (req, res) => {
    res.render("shop_setup/shop_setup_3", {

    })
})

// GET /shop_setUp/shop_setUp_4
router.get("/shop_setup_4", (req, res) => {
    res.render("shop_setup/shop_setup_4", {

    })
})

// GET /shop_setUp/shop_setUp_5
router.get("/shop_setup_5", (req, res) => {
    res.render("shop_setup/shop_setup_5", {

    })
})

// GET /shop_setUp/shop_setUp_6
router.get("/shop_setup_6", (req, res) => {
    res.render("shop_setup/shop_setup_6", {

    })
})

// GET /shop_setUp/shop_setUp_7
router.get("/shop_setup_7", (req, res) => {
    res.render("shop_setup/shop_setup_7", {

    })
})

router.post("#",(req,res)=>{
    
})


//=============handling the store image uploading========


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
  
  
  router.post('/upload', upload, (req, res) => {
    if (req.file == undefined) {
      res.render('shop_setup/shop_setup_5', {
        msg: 'Error: No File Selected!'
      });
      return 
    } 
    console.log(req.file)
    // store some info in the database
    res.render('shop_setup/shop_setup_6', {
      msg: 'File Uploaded!',
      message:'Your store looks amazing!',
      file: `uploads/${req.file.filename}`
    });
  });

//=============above: handling the store image uploading========


// "shop_setup/product_type"
router.post('/product_type', (req, res) => {

    // let sellerProductTypes = req.body.productTypeList
    // console.log(sellerProductTypes)
    // console.log(req.body)
    console.log("!backend check!")

    res.status(200).send(req.body.productTypeList)
    // rn it sends array on first request,
    // then object on second request
})

    module.exports = router;