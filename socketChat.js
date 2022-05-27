
const mysqlDB = require('./database/databaseAccessLayer')

module.exports = function(io) {

    //moving it in searate file later
    const moment = require('moment');

    const users=[]
    const messageArray = {
        store:[],
        buyer:[]
    }
    //-------------------------------------------

    let chatRooms = {}
    let socketBuyers = {}
    let socketSellers = {}



    // Run when client connects
    io.on('connection', socket => {


        const session = socket.request.session
        // console.log("------the sesssion is: ",session)
        let user = null
        let room = null




        if (session.buyer ) {
            buyer = session.buyer
            socketBuyers[socket.id] = buyer
            user = socketBuyers[socket.id]

        } else if (session.seller) {
            seller = session.seller
            socketSellers[socket.id] = seller
            user = socketSellers[socket.id]
        }

        if (!user) {
            io.to(socket.id).emit('GTFO')
        }
        // console.log('user connect', socket.id)
        // console.log('socketBuyers', socketBuyers)
        // console.log('socketSellers', socketSellers)


        // Join Private Room
        socket.on('joinRoom', (roomObject) => {
            // console.log("theroom id is: ", roomId)

            let roomId = roomObject.ROOM_ID
            // console.log("roomId", roomId,"storeName", storeName, "buyerName",buyerName )



            // Check if room exists
            if (!chatRooms[roomId]) {

                // Might need database information!
                chatRooms[roomId] = {
                    timestamp: Date.now(),
                    users: [],
                    chatHistory: 'chistory', // call database for chat history
                    roomId: roomId

                }
                room = chatRooms[roomId]
                socket.join(room.roomId)
                // io.to(room.roomId).emit('message', "messageStuff")

            } else {
                room = chatRooms[roomId]
                socket.join(room.roomId)

            }

            room.users.push(user)

            
        } )






        //listen for chatInputMessage
        socket.on('chatMessage',(msg)=>{
            let userName;
            let session = socket.request.session
            let timestamp = Date.now();
            // const user = getCurrentUser(socket.id)
            // console.log(user.room)

            if (session.buyer) {
                userName = session.buyer.name
                // messageArray.buyer.push({timestamp:timestamp, msg:msg})
                mysqlDB.addBuyerChatContent(room.roomId, {timestamp:timestamp, msg:msg})
                
            } else if (session.seller) {
                userName = session.seller.name
                // messageArray.store.push({timestamp:timestamp, msg:msg})
                mysqlDB.addStoreChatContent(room.roomId, {timestamp:timestamp, msg:msg})


            }

            // Update the chat table
            mysqlDB.updateLastMessage(room.roomId, msg, timestamp )


            io.to(room.roomId).emit('message', formatMessage(userName, msg))
        })

        
        // socket.on ('disconnect',()=>{

        // })
        
    });



///---------------------------------- related functions - move to different file--------------------

    //geting an object from the messge input data
    function formatMessage(username, text) {
        return {username, text, timestamp: moment().format('h:mm a')
        };
    }
    

    async function  getUserNames(currentRoomIId){
        return await mysqlDB.chatUsersName(currentRoomIId)
    }
    
}


