/* libraries */
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
// const cookieSession = require("cookie-session")
const session = require('express-session')
const mysql = require("mysql2")
const dbConnection = require("./database/databaseConnection.js")
    // const mysqlDB = require("./database/databaseAccessLayer.js")
const ejs = require("ejs")
const s3 = require("./s3")
var nodemailer = require('nodemailer');



// import cookieSession from "cookie-session"
// import mysql from "mysql2"
// import * as dbConnection from "./database/databaseConnection.js"
// import ejs from 'ejs'

//==image ===
const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const req = require("express/lib/request")


// other files 
const server = require("./server.js")

// router files. require the router js files
const shopSetupRouter = require("./routes/shop_setup_router")
const productPostRouter = require("./routes/product_post_router")
const ordersRouter = require("./routes/orders_router")
const sellerShopRouter = require("./routes/seller_shop_router")
const sellerLandingRouter = require("./routes/seller_landing_router")
const addCartRouter = require("./routes/add_cart_router")
const shoppingCartRouter = require("./routes/shopping_cart_router")
const followBusinessRouter = require("./routes/follow_business_router")
const buyerSetupRouter = require("./routes/buyer_setup_router")
const chatRouter = require("./routes/chat_router")
const checkoutRouter = require("./routes/checkout_router")
const analyticsRouter = require("./routes/analytics_router")
const wishlistRouter = require("./routes/wishlist_router")
const buyerProfileRouter = require("./routes/buyer_profile_router")
const mapsRouter = require("./routes/map_router")


// const sellerHomeRouter = require("./routes/seller_home_router")

// Session Middleware
const sessionMiddleware = session({
  secret: 'localscoop:8000',
  resave: false,
  saveUninitialized: false,
})


/*** express ***/
const app = express();

app.use(sessionMiddleware)
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static("public")); // allow front end to use the /public folder
app.use(express.json());
app.set('view engine', 'ejs'); // set templating engine to ejs


// cookie sessions


// app.use(cookieSession({
//   name:'session',
//   keys:['localscoop:8000'],
//   maxAge: 24 * 60 * 60 * 1000 // expired in 24 hours
// }))





/**   router routes, set beginning of path   **/
app.use("/shop_setup", shopSetupRouter);
app.use("/product_post", productPostRouter);
app.use("/orders", ordersRouter);
app.use("/seller_shop", sellerShopRouter);
app.use("/seller_landing", sellerLandingRouter)
app.use("/add_cart", addCartRouter)
app.use("/shopping_cart", shoppingCartRouter)
app.use("/follow_business", followBusinessRouter)
app.use("/buyer_setup", buyerSetupRouter)
app.use("/chat", chatRouter)
app.use("/checkout", checkoutRouter)
app.use("/analytics", analyticsRouter)
app.use("/map", mapsRouter)
app.use("/wishlist", wishlistRouter)
app.use("/buyer_profile", buyerProfileRouter)





//=======session:
// set the session:

// req.session.id = id
//
// get the session:
// let id = req.session.id
//
// req.session.buyer = {
//   buyer_id: id,
//   buyer_email:email
//
// }
//
// req.session.seller = {
//   seller_id: id,
//   seller_email: email
// }

// req.session.seller_info.email = email
// ==:



/* ROUTES */




// app.get("/", (req, res) => {
//     let sellerSession = req.session.seller
//     let buyerSession = req.session.buyer
//     res.render("index",{sellerSession,buyerSession})
// })



app.get("/", (req, res) => {
    req.session.apples = 3
    console.log(req.session.apples)
    if (!req.session) {
        res.render("index")
    }
    let sellerSession
    let buyerSession
    if(req.session.seller) {
        sellerSession = req.session.seller
        buyerSession = null
    }
    if (req.session.buyer) {
        buyerSession = req.session.buyer
        sellerSession = null
    }
console.log('seller', sellerSession)
    console.log('buyer', buyerSession)


    res.render("index", { sellerSession, buyerSession })
})

app.get("/index2", (req, res) => {
    res.render("index2")
})

// dcs = delete cookie session. unnecessary, but for ease of deleting cookies during dev
app.get("/dcs", (req, res) => {
    req.session.destroy()
    res.redirect("/");
})



// for s3 photo upload. Is an ajax route
app.get('/s3Url', async(req, res) => {
    const url = await s3.generateUploadURL()
    res.send({ url })
})



//====image upload===
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        const bytes = crypto.randomBytes(16).toString('hex')
        cb(null, bytes + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function(req, file, cb) {
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



// app.post('/upload', upload, (req, res) => {
//   if (req.file == undefined) {
//     res.render('/shop_setup/shop_setup_6', {
//       msg: 'Error: No File Selected!'
//     });
//     return 
//   } 
//   console.log(req.file)
//   // store some info in the database
//   res.render('shop_setup/shop_setup_6', {
//     msg: 'File Uploaded!',
//     file: `uploads/${req.file.filename}`
//   });
// });


// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MY_EMAIL,
//     pass: process.env.MY_PASS
//   }
// });

// var mailOptions = {
//   from: process.env.MY_EMAIL,
//   to: 'yoyochen68@yahoo.ca',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });






module.exports = { app, sessionMiddleware };
