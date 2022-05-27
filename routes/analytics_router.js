/* libraries */
const help = require("../help")
const express = require("express");
const ejs = require('ejs');
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')



const { append } = require("express/lib/response");


/* express */
const app = express();
app.use(express.json())

router.get("/analytics_1", help.sellerAuthorized,async (req, res) => {

    res.render("analytics/analytics_1")
})





module.exports = router;