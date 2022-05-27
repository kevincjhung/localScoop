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




// GET /buyer_profile/profile_setup
router.get("/profile_setup", async (req, res) => {
  // res.send("hi")
  let buyer_id = req.session.buyer.buyer_id
  let cartQuantity= await mysqlDB.getCartItemsCount(buyer_id)

  res.render("buyer_profile/profile_setup",{cartQuantity})
})



module.exports = router;