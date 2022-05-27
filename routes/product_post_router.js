// require
const help = require('../help')
const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const router = express.Router();
const mysqlDB = require("../database/databaseAccessLayer");


// GET /product_post/product_post_1
router.get("/product_post_1", help.sellerAuthorized, (req, res) => {
    res.render("product_post/product_post_1")
})


// is ajax route. when testing use valid store_id from db




router.post("/product_post_1", help.sellerAuthorized, async (req, res) => {
  let productInfo = req.body
  let storeId = req.session.seller.seller_id;
  let product_name = productInfo.productName
  let product_category = productInfo.category
  let product_description = productInfo.description
  let product_price = productInfo.productPrice
  let product_delivery_fee = productInfo.deliveryFee
  let imageUrl = req.body.imageUrl

  // add product into db. must provide store_id that exists in db when testing, else will crash
  let productId = await mysqlDB.addNewProduct(storeId, product_name, product_category, product_description, product_price, product_delivery_fee)

  // product photo and its link to the db
  req.session.newPostedProduct = await mysqlDB.addNewProductPhoto(productId, imageUrl)
  res.redirect('/product_post/product_post_2')
})


// GET /product_post/product_post_2

router.get("/product_post_2", help.sellerAuthorized, (req, res) => {

    let theProduct = req.session.newPostedProduct[0];



    // because we weren't consistent with naming
    let productInfo = {
        "productName": theProduct.product_name,
        "description": theProduct.product_description,
        "category": theProduct.product_category,
        "deliveryFee": theProduct.product_delivery_fee,
        "productPrice": theProduct.product_price,
        'imageFilePath': theProduct.image_file_paths[0]
    }

    res.render("product_post/product_post_2", {
        productInfo
    })
})



module.exports = router;













/*
Old Multer Code -  handling the store image uploading         

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


// User uploads photo on shop_setup/shop_setup_6
router.post('/upload', upload, (req, res) => {
  if (req.file == undefined) {
    res.render('product_post/product_post_1', {
      msg: 'Error: No File Selected!'
    });
    return
  }

  // let shopIdOfSession = db.getStoreIdFromStoreName(req.session.storeName)
  let multeredFilename = '/uploads/' + req.file.filename
  // console.log(multeredFilename)
  // db.editShop(shopIdOfSession, { shopProfilePhoto : multeredFilename })

  // store some info in the database
  res.render('product_post/product_post_1', {
    msg: 'Image Uploaded!',
    file: `${multeredFilename}`
  });
});

*/