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


router.get("/shopping_cart", help.buyerAuthorized, async(req, res) => {
// let buyer_id = req.session.buyer_id
let buyer_id = req.session.buyer.buyer_id
let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
let subtotal = 0
for(let cartItem of cartItems){
  subtotal= subtotal+ (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
}

  res.render("shopping_cart/shopping_cart", {buyer_id,cartItems,cartQuantity, subtotal})
})


router.post("/shopping_cart_add",help.buyerAuthorized, async (req, res)=>{
  let cart_product_id = +req.body.cart_product_id
  let buyer_id = +req.body.buyer_id
  let product_id = +req.body.product_id
  let cartIterm = await mysqlDB.inCartItem(cart_product_id,buyer_id,product_id)
  let itermQuantity = cartIterm.product_quantity
  let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
  let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
  let subtotal = 0
  for(let cartItem of cartItems){
    subtotal= subtotal+ (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
  }
  res.json({itermQuantity,cartQuantity,subtotal})
})


router.post("/shopping_cart_minus",help.buyerAuthorized, async (req, res)=>{
  let cart_product_id = +req.body.cart_product_id
  let buyer_id = +req.body.buyer_id
  let product_id = +req.body.product_id
  let cartIterm = await mysqlDB.deCartItem(cart_product_id,buyer_id,product_id)
  let itermQuantity = cartIterm.product_quantity
  let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
  let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
  let subtotal = 0
  for(let cartItem of cartItems){
    subtotal= subtotal+ (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
  }
  res.json({itermQuantity,cartQuantity,subtotal})
})

router.post('/shopping_cart_removeItem',help.buyerAuthorized,  async(req, res) => {
  let cart_product_id = +req.body.cart_product_id
  let buyer_id = +req.body.buyer_id
  await mysqlDB.deleteCartItem(cart_product_id)
  res.json({message:"Have removed the item in cart"})
})


// router.post('/checkout',async(req,res)=>{
//   res.redirect('/checkout/checkout')
// })



module.exports = router;