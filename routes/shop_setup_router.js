/* libraries */
const help = require('../help')
const express = require("express");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
// const db = require("../fake-db");
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')
const s3 = require("../s3");


const { append, render } = require("express/lib/response");
const res = require("express/lib/response");


/* express */
const app = express();
app.use(express.json())


router.get("/a", (req, res) => {
  res.send('ajsdhfklasjdhf klasjdf')
})


// GET /shop_setUp/login_signup
router.get("/login_signup", (req, res) => {
  res.render("shop_setup/login_signup", {

  })
})


// GET /shop_setUp/shop_login
router.get("/shop_login", (req, res) => {
  res.render("shop_setup/shop_login", {
  })
})


// POST /shop_setUp/shop_login
router.post("/shop_login", async (req, res) => {
  let email = req.body.store_email;
  let password = req.body.store_password;
  let shopOwner = await mysqlDB.authenticateShopOwner(email, password)
  // console.log(shopOwner)
  // console.log(shopOwner.length === 0)
  if (shopOwner && shopOwner.length === 0) {
    res.redirect("/shop_setup/shop_login")
    return
  }
  const id = shopOwner[0].store_id

  req.session.seller = {
    seller_id: id,
    seller_email: email
  }

  // let store_email = req.session.store_email ? req.session.store_email : null;
  res.redirect("/seller_landing/seller_landing")
})


// GET /shop_setUp/shop_setUp_1
router.get("/shop_setup_1", async (req, res) => {
  
  res.render("shop_setup/shop_setup_1")
})




// GET /shop_setUp/shop_setUp_2
router.get("/shop_setup_2", async (req, res) => {
  res.render("shop_setup/shop_setup_2")
})


// POST /shop_setUp/shop_setUp_2

router.post("/shop_setup_2", async (req, res) => {

  // retrieve user input from req.body
  let store_name = req.body.storeName;
  let store_phone_number = req.body.phoneNum;
  let store_email = req.body.email;
  let store_password = req.body.password;

  if (store_name == null || store_phone_number == null || store_email == null || store_password == null) {
    // user did not give all of required info, redirect to the same page 
    res.redirect("/shop_setup/shop_setup_2")
  }

  // write store name into database
  let newStore = await mysqlDB.addShop(store_name, store_phone_number, store_email, store_password);
  let id = newStore[0].store_id

  req.session.seller = {
    seller_id: id,
    seller_email: store_email
  }

  // redirect to next page
  res.redirect(`/shop_setup/shop_setup_3`)
})



// GET /shop_setUp/shop_setUp_3

router.get("/shop_setup_3", help.sellerAuthorized,async (req, res) => {

  let newStoreId = req.session.seller.seller_id

  res.render("shop_setup/shop_setup_3", { newStoreId })
})


// POST /shop_setUp/shop_setUp_3
router.post("/shop_setup_3", async (req, res) => {
  let storeAddress = req.body.address;
  let newStoreId = req.session.seller.seller_id

  if (storeAddress == null) return

  await mysqlDB.updateShopAddressByStoreId(newStoreId, storeAddress)
  res.redirect(`/shop_setUp/shop_setUp_4`)
})




// GET /shop_setUp/shop_setUp_4

router.get("/shop_setup_4", help.sellerAuthorized,async (req, res) => {
  let newStoreId = req.session.seller.seller_id

  res.render("shop_setup/shop_setup_4", { newStoreId })
})



// GET /shop_setUp/shop_setUp_5

router.get("/shop_setup_5", help.sellerAuthorized,async (req, res) => {

  let newStoreId = req.session.seller.seller_id

  res.render("shop_setup/shop_setup_5", { newStoreId })
})



// GET /shop_setUp/shop_setUp_6


router.get("/shop_setup_6", help.sellerAuthorized,async (req, res) => {

  let newStoreId = req.session.seller.seller_id


  res.render("shop_setup/shop_setup_6", { newStoreId })
})



// POST /shop_setup/uploadS3
router.post('/uploadS3', async (req, res) => {

  // At some point check the session exists for the logged in user
  // console.log(req.session)
  let newStoreId = req.session.seller.seller_id

  let imageUrl = req.body.imageUrl;

  await mysqlDB.updateShopPhotoByStoreId(newStoreId, imageUrl)
})




// GET /shop_setUp/shop_setUp_7

router.get("/shop_setup_7", help.sellerAuthorized,async (req, res) => {

  let newStoreId = req.session.seller.seller_id

  res.render("shop_setup/shop_setup_7", { newStoreId })
})





/*   Multer code that we are no longer using */

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
async function checkFileType(file, cb) {
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
router.post('/upload', upload, async (req, res) => {
  if (req.file === undefined) {
    res.render('shop_setup/shop_setup_5', {
      msg: 'Error: No File Selected!'
    });
    return
  }

  let newStoreId = req.session.seller.seller_id
  let multeredFilename = '/uploads/' + req.file.filename

  // await mysqlDB.updateShopCategoryByStoreId(newStoreId, multeredFilename )


  // store some info in the database
  res.render(`shop_setup/shop_setup_6`, {
    msg: 'Image Uploaded!',
    file: `${multeredFilename}`,
    newStoreId: newStoreId
    // newStoreId: newStoreId
  });
});


// used by axios request from shop_setup_4.ejs
// "shop_setup/product_type"
router.post('/product_type', async (req, res) => {
  let sellerProductTypes = req.body.productTypeList
  let newStoreId = req.session.seller.seller_id
  
  let updatedStore = await mysqlDB.updateShopCategoryByStoreId(newStoreId, sellerProductTypes)

  res.status(200).send(updatedStore[0].categories)
})



router.post('/delivery_type', async (req, res) => {
  // let storeId = req.session.storeId ? req.session.storeId : null;
  let newStoreId = req.session.seller.seller_id
  let deliveryMethodList = req.body.deliveryMethodList

  let updatedStore = await mysqlDB.updateShopDeliveryByStoreId(newStoreId, deliveryMethodList.delivery, deliveryMethodList.pickup, deliveryMethodList.kmRadius)
  res.status(200).send(updatedStore)


})





module.exports = router;