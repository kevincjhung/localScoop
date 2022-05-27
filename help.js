//check if the session exist,if exist,  
const mysqlDB = require('./database/databaseAccessLayer')


function sellerAuthorized(req, res, next) {
    if (!req.session.seller) {
        res.redirect("/index2")
   
        return
    }
    next()

}
exports.sellerAuthorized = sellerAuthorized

function buyerAuthorized(req, res, next) {
    if (!req.session.buyer) {
        res.redirect("/index2")
       
        return
    }
    next()

}

exports.buyerAuthorized = buyerAuthorized




