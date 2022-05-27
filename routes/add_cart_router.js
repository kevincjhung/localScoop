/* libraries */
const help = require("../help")
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')



//all products
router.get("/products", help.buyerAuthorized, async (req, res) => {

    // let buyer_id = 1
    let buyer_id = req.session.buyer.buyer_id
    let searchString = null

    //make it based on ast added later
    let productInfo = await mysqlDB.getRandomProducts()
    let cartItemsTotal = await mysqlDB.getCartItemsCount(buyer_id)

    res.render("add_cart/products", { productInfo: productInfo, cartItemsTotal: cartItemsTotal, searchString })

})

//all products


router.post("/products", help.buyerAuthorized, async (req, res) => {
    // let buyer_id = 1
    let buyer_id = req.session.buyer.buyer_id
    let searchString = req.body.search

    let productInfo = await mysqlDB.searchProduct(searchString)
    let cartItemsTotal = await mysqlDB.getCartItemsCount(buyer_id)

    res.render("add_cart/products", { productInfo, cartItemsTotal, searchString })

})



// single product
// GET /add_cart/add_cart/id
router.get("/add_cart/:id", help.buyerAuthorized, async (req, res) => {
    let product_id = req.params.id
    // let buyer_id = 1
    let buyer_id = req.session.buyer.buyer_id

    let productInfo = await mysqlDB.getProductsAndImages(product_id)
    let storeInfo = await mysqlDB.getStoreInfoByStoreId(productInfo[0].store_id)
    let cartItemsTotal = await mysqlDB.getCartItemsCount(buyer_id)



    //=====wishlist=====

    let wishlistItem = await mysqlDB.getItemInWishlistProduct(buyer_id, product_id)
 
    res.render("add_cart/add_cart", { productInfo: productInfo[0], storeInfo: storeInfo[0], cartItemsTotal: cartItemsTotal, wishlistItem })
})






// ajax request destination
router.post("/add_cart/:id", help.buyerAuthorized, async (req, res) => {

    let product_id = req.params.id
    let buyer_id = req.session.buyer.buyer_id
    await mysqlDB.addToCart(buyer_id, product_id)
    let cartItemsTotal = await mysqlDB.getCartItemsCount(buyer_id)
    res.json({ quantity: cartItemsTotal })
})



router.post('/add_to_wishlist/:id', help.buyerAuthorized, async (req, res) => {

    let product_id = +req.params.id
    let buyer_id = +req.session.buyer.buyer_id
    let addToWishlist = await mysqlDB.addToWishlist(buyer_id, product_id)

    if (addToWishlist) {
        res.json({massage: "Have add to wishlist"})
    }
})






module.exports = router;