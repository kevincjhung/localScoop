/* libraries */
const help = require("../help")
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();



const { append } = require("express/lib/response");
const mysqlDB = require("../database/databaseAccessLayer");
// const { ConfigurationServicePlaceholders } = require("aws-sdk/lib/config_service_placeholders");


/* express */
const app = express();
app.use(express.json())

//
// router.get("/buyer_setup", (req, res) => {
//
//
//   // res.render("shopping_cart/shopping_cart", {
//   // })
// })



router.get("/login_signup", async (req, res) => {
    res.render("buyer_setup/login_signup")
})



router.get("/buyer_login", async (req, res) => {
    res.render("buyer_setup/buyer_login", {
    })
})



// POST /buyer_setup/buyer_login
router.post("/buyer_login", async (req, res) => {
    let email = req.body.buyer_email;
    let password = req.body.buyer_password;
    let buyer = await mysqlDB.authenticateBuyer(email, password)
    if (buyer.length === 0) {
        res.redirect("/buyer_setup/buyer_login")
        return
    }
  
    const id = buyer[0].buyer_id


    req.session.buyer = {}
    req.session.buyer.buyer_id = id
    req.session.buyer.buyer_email = email



    // let store_email = req.session.store_email ? req.session.store_email : null;
    res.redirect("/follow_business/follow_business_1")
})




router.get("/buyer_signup", async (req, res) => {
    res.render("buyer_setup/buyer_signup")
})

router.post("/buyer_signup", async (req, res) => {

// retrieve user input from req.body
    let buyer_name = req.body.buyerName;
    let buyer_lastname= ""
    let buyer_phone_number = req.body.phoneNum;
    let buyer_email = req.body.email;
    let buyer_password = req.body.password;

    if (buyer_name == null || buyer_phone_number == null || buyer_email == null || buyer_password == null) {
        res.redirect("/shop_setup/shop_setup")
    }

// write store name into database
    let newBuyer = await mysqlDB.addBuyer(buyer_name,buyer_lastname, buyer_phone_number, buyer_email, buyer_password);
    let id = newBuyer.buyer_id

    req.session.buyer = {
        buyer_id: id,
        buyer_email: buyer_email
    }


// redirect to next page
    res.redirect(`/follow_business/follow_business_1`)






})

module.exports = router;