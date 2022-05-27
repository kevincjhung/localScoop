/* libraries */
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const help = require('../help')


//formating the message shown
// const formatMessage = require('../views/chat/utils/messages')

const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')






//chat/create
router.get("/create/:id",  async (req, res) => {

    let buyerId = req.session.buyer.buyer_id
    let storeId = await mysqlDB.getStoreIdFromProductId(req.params.id)

    //check if chatroom already exist if not creates it
    let chatExist= await mysqlDB.chatExist(buyerId, storeId)
    if(!chatExist) mysqlDB.createChat(buyerId, storeId)

    let chat = await mysqlDB.getChat(buyerId, storeId)
    let chatId = chat.chat_id

    res.redirect(`/chat/room/${chatId}`)

})




router.get("/store", help.sellerAuthorized,  async (req, res) => {

    let storeId = req.session.seller.seller_id

    // Geting the chatrooms related to the store id
    let storeChatList = await mysqlDB.getStoreChats(storeId)
    console.log(storeChatList)


    res.render("chat/store_index",{storeChatList:storeChatList});

})





//chat/buyer
// router.get("/buyer", help.buyerAuthorized,async (req, res) => {
router.get("/buyer",async (req, res) => {

    let buyerId = req.session.buyer.buyer_id


    // Geting the chatrooms related to the store id
    let buyerChatList = await mysqlDB.getBuyerChats(buyerId)
    console.log("buyerChatList", buyerChatList)


    res.render("chat/buyer_index", {buyerChatList:buyerChatList});
})








router.get("/room/:id",  async (req, res) => {
    req.session.authenticated = true

    let roomId = req.params.id
    let chatUserInfo = await mysqlDB.getChatUserinfo(roomId)
    let roomUsers = await mysqlDB.chatUsersName(roomId)

    let cp={}
    console.log("chatUserInfo",chatUserInfo)


    // console.log("routerObject", roomUsers)
    
    if(req.session.seller) {
        req.session.seller.name = roomUsers.storeName

        cp.name = chatUserInfo[0].buyer_name
        cp.image = chatUserInfo[0].buyer_image


    }else {
        req.session.buyer.name = roomUsers.buyerName

        cp.id = chatUserInfo[0].store_id
        cp.name = chatUserInfo[0].store_name
        cp.image = chatUserInfo[0].store_images[0]

    }




    let chistory =  await mysqlDB.getChatContent(roomId)

    // console.log('render room')
    // console.log("roomId:",roomId)

    console.log(cp.id, cp.name, cp.image)
    
    res.render("chat/room",{ roomId:roomId, chistory: chistory,cp});
    // res.render("chat/room",{roomId:roomId, storeName:storeName, buyerName:buyerName});

})








module.exports = router;