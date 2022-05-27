
/* libraries */

const help = require("../help")

const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')

// time library
const luxon = require('luxon')
let DateTime = luxon.DateTime;



/**
 * For demonstration purposes, change req.session.store_id to 2
 */
// GET orders/orders_1


router.get("/orders_1", help.sellerAuthorized, async(req, res) => {
    let storeId = req.session;
    // if user not logged in, redirect to login page
    // if(storeId == undefined){
    //     res.redirect("/")
    // }
    let seller_id = req.session.seller.seller_id

    let carouselSliderData = await mysqlDB.getOrdersWithProductsPhotosByStoreId(seller_id)
    console.log(carouselSliderData)
    // loop through all orders, take timestamp, calculate how long ago it was, write to {}
    for(let order of carouselSliderData){
        let timestamp = +order.product_timestamp;
        let timeInfo = DateTime.fromMillis(timestamp);
        let howManyDaysAgo = timeInfo.plus({ days: 0 }).toRelativeCalendar()
        // add how many days ago to the object returned from db
        order.how_many_days_ago = howManyDaysAgo
    }

    res.render("./orders/orders_1", {
       carouselSliderData 
    })  
})


router.get("/orders_2", help.sellerAuthorized, async (req, res) => {
    let seller_id = req.session.seller.seller_id
    let productListInfo = [
        { itemName: "Ultra Boost 912", deliveryStatus: "Pending Delivery", feedbackStatus: "", time: "Today" },
        { itemName: "Nike AirMax", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "2 Days Ago" },
        { itemName: "Nike AirForce", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "3 Days Ago" },
        { itemName: "Nike Blazer", deliveryStatus: "Delivery Pending", feedbackStatus: "", time: "4 Days Ago" },
        { itemName: "Mens Leather Boots", deliveryStatus: "Delivered", feedbackStatus: "", time: "1 Week Ago" },
        { itemName: "Ultra Boost 912", deliveryStatus: "Pending Delivery", feedbackStatus: "", time: "1 Week Ago" },
        { itemName: "Nike AirMax", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "1 Week Ago" },
        { itemName: "Nike AirForce", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "1 Week Ago" },
        { itemName: "Nike Blazer", deliveryStatus: "Delivery Pending", feedbackStatus: "", time: "2 Weeks Ago" },
        { itemName: "Mens Leather Boots", deliveryStatus: "Delivered", feedbackStatus: "", time: "2 Weeks Ago" }, 
    ]
    
    let orderData = await mysqlDB.getOrdersWithProductsPhotosByStoreId(seller_id);

    // loop through all orders, take timestamp, calculate how long ago it was, write to {}
    for(let order of orderData){
        let timestamp = +order.product_timestamp;
        let timeInfo = DateTime.fromMillis(timestamp);
        let howManyDaysAgo = timeInfo.plus({ days: 0 }).toRelativeCalendar();
        
        // add how many days ago to the object returned from db
        order.how_many_days_ago = howManyDaysAgo;
    }

    // console.log(orderData)
    res.render("./orders/orders_2", {
        orderData
    })
})











module.exports = router;

