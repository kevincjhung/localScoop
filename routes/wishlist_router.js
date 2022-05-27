/* libraries */
const help = require("../help")
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')

const { append } = require("express/lib/response");

/* express */
const app = express();
app.use(express.json())


router.get("/wishlist_1", help.buyerAuthorized, async (req, res) => {

    let buyer_id = req.session.buyer.buyer_id
    let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
    let allWishlist = await mysqlDB.getAllWishlistByBuyer(buyer_id)


    // let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
    // let subtotal = 0
    // for (let cartItem of cartItems) {
    //     subtotal = subtotal + (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
    // }

    res.render("wishlist/wishlist_1", { cartQuantity, allWishlist })
})




router.post("/wishlist_removeItem", help.buyerAuthorized, async (req, res) => {
    let wishlist_product_id = +req.body.wishlist_product_id
    
    await mysqlDB.deleteWishlistItem(wishlist_product_id)

    res.json({ message: "Have removed the item in wishlist" })
})



// router.post('/wishlist/add_to_cart' + product_id){

// }

module.exports = router;