// require
const help = require("../help")
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();
// const axios = require('axios')
const mysqlDB = require('../database/databaseAccessLayer')


/* Global Variables */

// GET /seller_landing/seller_landing
// router.get("/seller_landing/:id", (req, res) => {
//     res.render("seller_landing/seller_landing")
// })


/**
 * This redirects to the analytics page, 
 */
// GET /seller_landing/seller_landing
router.get("/seller_landing",help.sellerAuthorized, (req, res) => {
    let newStoreId = req.session.storeId
    let email = req.session.email
    res.render("seller_landing/seller_landing",{newStoreId,email})
})





module.exports = router;