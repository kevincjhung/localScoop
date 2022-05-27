/** database setup */
const res = require("express/lib/response");
const mysql = require("mysql2");
const { doesShopExist } = require("../fake-db");
const is_heroku = process.env.IS_HEROKU || false;
const { sendFile } = require("express/lib/response");



// environment variables: for hiding api keys and mysql login
const dotenv = require("dotenv")
dotenv.config()


let database;
const dbConfigHeroku = {
    host: process.env.DBCONFIG_HEROKU_HOST,
    user: process.env.DBCONFIG_HEROKU_USER,
    password: process.env.DBCONFIG_HEROKU_PASSWORD,
    database: process.env.DBCONFIG_HEROKU_DATABASE,
    multipleStatements: false,
    namedPlaceholders: true
};


const dbConfigLocal = {
    host: "localhost",
    user: process.env.DBCONFIG_LOCAL_USERNAME,
    password: process.env.DBCONFIG_LOCAL_PASSWORD,
    database: process.env.DBCONFIG_LOCAL_DATABASE,
    port: 3306,
    multipleStatements: false,
    namedPlaceholders: true
};




if (is_heroku) {
    database = mysql.createPool(dbConfigHeroku).promise();
} else {
    database = mysql.createPool(dbConfigLocal).promise();
}


/*****      Functions     *****/
/**
 * @param {number} store_id 
 * @returns all products belonging to a store
 */
async function getProductsByStoreId(store_id) {
    let query = `
    SELECT product.*, store.store_name, product_photo.photo_file_path
    FROM product
    LEFT JOIN store
    ON store.store_id = product.store_id
    LEFT JOIN product_photo
    ON product.product_id = product_photo.product_id
    WHERE store.store_id = ?
    `

    let [products, fields] = await database.query(query, [store_id])
    return products
}
exports.getProductsByStoreId = getProductsByStoreId



/** 
 * NEEDS TO BE REWRITTEN  asdf
 *  get all the orders by the giving store id in the order table
 * @param {number} store_id. 
 */
async function getOrdersByStoreId(store_id) {
    // has to be single line. because we used a sql keyword as table name. SO we cannot use backticks to wrap the string
    let query = "select * from `order` WHERE store_id = ?";

    let orders = await database.query(query, [store_id]);
    return orders[0];
}
exports.getOrdersByStoreId = getOrdersByStoreId


/**
 * NEEDS TO BE REWRITTEN  asdf
 * @param {number} store_id 
 * @returns array of objects, orders and info of its products by store_id 
 */
async function getOrdersWithProductsPhotosByStoreId(store_id) {
    // if sql command run with no store_id, everything will crash
    if (store_id == undefined) {
        return;
    }

    let query = 'SELECT * FROM `order` LEFT JOIN product ON `order`.product_id = `product`.product_id LEFT JOIN product_photo on `product_photo`.product_id = `order`.product_id LEFT JOIN order_status ON `order_status`.order_status_id = `order`.order_status_id WHERE `order`.store_id = ?'


    let orders = await database.query(query, [store_id]);
    return orders[0];
}
exports.getOrdersWithProductsPhotosByStoreId = getOrdersWithProductsPhotosByStoreId
// getOrdersWithProductsPhotosByStoreId(1).then(console.log)



async function authenticateShopOwner(store_email, store_password) {
    let query = `
        SELECT * 
        FROM store 
        WHERE store_email = ? and store_password = ?;`

    let [validatedShopOwner, filed] = await database.query(query, [store_email, store_password])
    return validatedShopOwner
}
exports.authenticateShopOwner = authenticateShopOwner
// authenticateShopOwner("localscoop@gmail.com", "localscoop").then(console.log)
// authenticateShopOwner("local", "localsc").then(console.log)




async function authenticateBuyer(buyer_email, buyer_password) {
    let query = `SELECT * FROM buyer WHERE buyer_email = ? and buyer_password = ?;`
    let [validatedBuyer, filed] = await database.query(query, [buyer_email, buyer_password])
    return validatedBuyer
}
exports.authenticateBuyer = authenticateBuyer
// authenticateBuyer("localscoop@gmail.com", "localscoop").then(console.log)
// authenticateBuyer("local", "localsc").then(console.log)



async function getAllStores() {
    let sqlQuery = `SELECT * FROM store_photo ORDER BY store_id ASC `
    const [stores, fields] = await database.query(sqlQuery)
    return stores
}
exports.getAllStores = getAllStores
// getAllStores().then(console.log)


async function getAllProducts() {
    let sqlQuery = `SELECT * FROM product_photo ORDER BY product_id ASC `
    const [products, fields] = await database.query(sqlQuery)
    return products
}
exports.getAllProducts = getAllProducts
// getAllProducts().then(console.log)


//there canbe a better way for the store limit
async function getRandomStores(quantity = 100) {

    let sqlQuery = `SELECT * FROM storesAndImages ORDER BY RAND() LIMIT ? `
    const [stores, fields] = await database.query(sqlQuery, [quantity])
    return stores
}
exports.getRandomStores = getRandomStores



async function getRandomProducts(quantity = 100) {
    let sqlQuery = `SELECT * FROM productsAndImages ORDER BY RAND()LIMIT ? `
    const [products, fields] = await database.query(sqlQuery, [quantity])
    return products

}

exports.getRandomProducts = getRandomProducts






/**
 * @param store_id
 * @returns {Promise<*>}
 */
async function getStoreInfoByStoreId(store_id) {

    let query = `
        SELECT store.*, 
        GROUP_CONCAT(DISTINCT category.category_name ORDER BY category.category_id SEPARATOR', ') AS "categories",
        GROUP_CONCAT(DISTINCT store_photo.photo_file_path SEPARATOR', ') AS "photos"

        FROM store
        LEFT JOIN store_category 
        ON store.store_id = store_category.store_id
        LEFT JOIN category
        ON store_category.category_id = category.category_id
        LEFT JOIN store_photo
        ON store.store_id = store_photo.store_id
        WHERE store.store_id = ?
        group by store_id `

    let [store, fields] = await database.query(query, [store_id])
    return store
}
exports.getStoreInfoByStoreId = getStoreInfoByStoreId
// getStoreInfoByStoreId(1).then(console.log)




//===================SHOP SETUP=========================

/**
 *
 * @param store_name
 * @param store_phone_number
 * @param store_email
 * @param store_password
 * @returns {*}
 */
async function addShop(store_name, store_phone_number, store_email, store_password) {
    let query = `
    INSERT INTO store (store_name, store_phone_number, store_email, store_password) 
    VALUES ( ?, ?, ?, ?);`;

    let newStoreInfo = await database.query(query, [store_name, store_phone_number, store_email, store_password]);
    let newStoreId = newStoreInfo[0].insertId

    // console.log(newStoreId)
    return getStoreInfoByStoreId(newStoreId)
}
exports.addShop = addShop
// addShop("store_name", "store_phone_number", "store_email", "store_password_hash").then(console.log)







/**
 * @param store_id
 * @param store_address
 * @returns {Promise<*>}
 */
async function updateShopAddressByStoreId(store_id, store_address = "") {
    let query = `
        UPDATE store
        SET store_address = ?
        WHERE store.store_id  = ?;
        `
    await database.query(query, [store_address, store_id])
    return getStoreInfoByStoreId(store_id)
}
exports.updateShopAddressByStoreId = updateShopAddressByStoreId
// updateShopAddressByStoreId(1,"123 Robson ST").then(console.log)



/**
 *
 * @param categoryNameList
 * @returns {Promise<*[]>}
 */
async function getCategoryIdByCategoryName(categoryNameList) {
    let categoryIdList = []

    // likely problem with query
    let query = `
        SELECT category.category_id
        FROM category
        WHERE category.category_name=?;`

    for (let categoryName of categoryNameList) {
        let [idObjectOfName, fields] = await database.query(query, [categoryName])
        // console.log( "idObjectOfName: ",idObjectOfName)
        let idOfName = JSON.parse(idObjectOfName[0]['category_id'])
        categoryIdList.push(idOfName)
    }
    return categoryIdList
}
exports.getCategoryIdByCategoryName = getCategoryIdByCategoryName






/**
 * @param store_id
 * @param categoryNameList
 * @returns {Promise<*>}
 */
async function updateShopCategoryByStoreId(store_id, categoryNameList) {

    console.log('store_id:    ' + store_id)
    console.log('category name list:   ' + categoryNameList)


    let catIdList = await getCategoryIdByCategoryName(categoryNameList)
    let query = `
         INSERT INTO store_category (store_id, category_id)
         VALUES (?, ?);`

    for (let catId of catIdList) await database.query(query, [store_id, catId])
    return getStoreInfoByStoreId(store_id)
}
exports.updateShopCategoryByStoreId = updateShopCategoryByStoreId
// updateShopCategoryByStoreId(1,[2, 3, 4]).then(console.log)
// updateShopCategoryByStoreId(1,["beauty", "stationary", "art"]).then(console.log)



/**
 * @param store_id
 * @param delivery
 * @param pickup
 * @param radius
 * @returns {Promise<*>}
 */
async function updateShopDeliveryByStoreId(store_id, delivery = 0, pickup = 0, radius = 0) {

    let query = `
    UPDATE store
    SET store.delivery = ?,
    store.pickup = ?,
    store.radius = ?
    WHERE store.store_id = ?;`

    await database.query(query, [delivery, pickup, radius, store_id])
    return getStoreInfoByStoreId(store_id)
}
exports.updateShopDeliveryByStoreId = updateShopDeliveryByStoreId
// updateShopDeliveryByStoreId(1,0,1,0).then(console.log)



/**
 * @param store_id
 * @param photo_path
 */
async function updateShopPhotoByStoreId(store_id, photo_path = "") {
    let query = `
    INSERT INTO store_photo(store_id, photo_file_path) 
    VALUE(?, ?)`

    await database.query(query, [store_id, photo_path])
}
exports.updateShopPhotoByStoreId = updateShopPhotoByStoreId


// function update_shop_photo_by_store_id(){
//     let query = `
//     INSERT INTO store_photo(store_id, photo_file_path) 
//     VALUE(?, ?)`

// }
// exports.update_shop_photo_by_store_id = update_shop_photo_by_store_id





//===================SELLER-SHOP =========================


async function getShopPhotoByStoreId(store_id) {

    let query = `
          SELECT store.store_id, 
          JSON_ARRAYAGG(store_photo.photo_file_path) AS "photos"
          FROM store
          LEFT JOIN store_photo
          ON store.store_id = store_photo.store_id
          WHERE store.store_id = ?
          group by store.store_id 
         `

    let [store, fields] = await database.query(query, [store_id])
    const photos = store[0].photos.filter(a => a)
    return photos

    //           GROUP_CONCAT(DISTINCT store_photo.photo_file_path SEPARATOR', ') AS "photos"
    //             FROM store
    //             LEFT JOIN store_photo
    //             ON store.store_id = store_photo.store_id
    //             WHERE store.store_id = ?
    //             group by store_id `

    //     let [store, fields] = await database.query(query,[store_id])
    //     let allPhotosString = store[0].photos
    //     return allPhotosString.split(", ")

}
exports.getShopPhotoByStoreId = getShopPhotoByStoreId
// getShopPhotoByStoreId(1).then(console.log)



async function getProductsAndImagesByStoreID(store_id) {
    let sqlQuery = `SELECT * FROM productsAndImages WHERE store_id = ?`
    const [product, fields] = await database.query(sqlQuery, [store_id])
    return product
}
exports.getProductsAndImagesByStoreID = getProductsAndImagesByStoreID




//works for local database
async function getAllBuyers() {
    let sqlQuery = "SELECT buyer_id, buyer_firstname, buyer_lastname, buyer_email, buyer_phone_number, buyer_gender, buyer_date_of_birth, buyer_profile_photo, buyer_address FROM buyer";
    const [AllBuyers] = await database.query(sqlQuery);
    return AllBuyers;
}
exports.getAllBuyers = getAllBuyers
// getAllBuyers().then(console.log)



//works for local database
async function getBuyer(buyer_id) {
    let sqlQuery = "SELECT buyer_id, buyer_firstname, buyer_lastname, buyer_email, buyer_phone_number, buyer_gender, buyer_date_of_birth, buyer_profile_photo, buyer_address FROM buyer WHERE buyer_id = ? ";
    const [AllBuyers] = await database.query(sqlQuery, [buyer_id]);
    const buyer = AllBuyers[0];
    return buyer;
}
exports.getBuyer = getBuyer
// getBuyer(2).then(console.log)



//works for local database
async function getProductsAndImages(product_id) {
    let sqlQuery = `SELECT * FROM productsAndImages WHERE product_id = ?`
    const [product, fields] = await database.query(sqlQuery, [product_id])
    return product
}
exports.getProductsAndImages = getProductsAndImages
// getProductsAndImages(76).then(console.log)



//works for local database
async function addNewProduct(store_id, product_name, product_category, product_description, product_price, product_delivery_fee) {
    let query = `INSERT INTO product(store_id,product_name, product_category, product_description, product_price, product_delivery_fee) VALUE (?, ?, ?, ?, ?, ?)`
    const [newproductInfo] = await database.query(query, [store_id, product_name, product_category, product_description, product_price, product_delivery_fee])
    return +newproductInfo.insertId
    // const  id = +newproductInfo.insertId
    // console.log(id)
    // return await getProductsAndImages(id)
}
exports.addNewProduct = addNewProduct
// addNewProduct(2,"pp", "food", "olive", 20, 10).then(console.log)


async function addNewProductPhoto(product_id, photo_file_path) {
    let query = `
        INSERT INTO product_photo(product_id, photo_file_path) 
        VALUE(?, ?)`

    const newProductPhoto = await database.query(query, [product_id, photo_file_path])
    return await getProductsAndImages(product_id)
}
exports.addNewProductPhoto = addNewProductPhoto
// addNewProductPhoto(2,"dfgvdfvd444").then(console.log)


async function productsAndImagesViews() {
    let query = `SELECT *  FROM  productsandimages`
    return await database.query(query)
}
exports.productsAndImagesViews = productsAndImagesViews


async function storesAndImagesViews() {
    let query = `SELECT *  FROM  storesandimages`
    return await database.query(query)
}
exports.storesAndImagesViews = storesAndImagesViews


//======yasmina code for add to cart===

async function getCartIdByBuyerId(buyerId) {
    let query = `
        SELECT cart_id
        FROM cart
        WHERE buyer_id = ? AND purchased = "no" `
    const [buyerActiveCartId] = await database.query(query, [buyerId])

    if (buyerActiveCartId.length) {
        return buyerActiveCartId[0]['cart_id']
    } else {
        let addNewCartquery = `INSERT INTO cart(buyer_id) VALUE (?)`
        const [buyerActiveCartId] = await database.query(addNewCartquery, [buyerId]) 
        let cart_id = buyerActiveCartId.insertId
        return cart_id;
    }
}
exports.getCartIdByBuyerId = getCartIdByBuyerId
// getCartIdByBuyerId(3).then((res) => console.log("useful", res))
// getCartIdByBuyerId(3).then(console.log)



async function addToCart(buyerId, productId) {
    //finding the cartId
    let cartId = await getCartIdByBuyerId(buyerId);

    //-----------------------------------create the cart if it does not exist

    //checking if order exist already
    let sqlQuery = ` SELECT product_quantity FROM cart_product WHERE cart_id = ? AND product_id = ?`
    let [productMatches, fields] = await database.query(sqlQuery, [cartId, productId])
    let cartItemExist = productMatches.length !== 0
    let query;

    if (cartItemExist) {
        //if the item existed change the quantity
        query = `UPDATE cart_product
        SET cart_product.product_quantity = cart_product.product_quantity + 1
        WHERE cart_id = ? AND product_id = ? `

    } else {
        //if the item did not exist insert new row
        query = ` INSERT INTO cart_product(cart_id, product_id, product_quantity)VALUES (?,?,1)`
    }

    await database.query(query, [cartId, productId])
    return getCartItemsCount(buyerId)
    // later you can substitute it with better return value
}

exports.addToCart = addToCart

// addToCart(1,3).then(console.log)
//buyer id 1 has the cart number 2




async function getCartItemsCount(buyerId) {
    let cartId = await getCartIdByBuyerId(buyerId);

    let query = ` 
        SELECT SUM(product_quantity) AS product_quantity
        FROM cart_product
        WHERE cart_id = ?;`

    const [itemsCountObject, fields] = await database.query(query, [cartId])
    return itemsCountObject[0].product_quantity

}
exports.getCartItemsCount = getCartItemsCount





//====YOYO CODE FOR ADD TO CART======


async function getCartItemsByBuyer(buyer_id) {
    let query = `
        select cp.cart_product_id,b.buyer_id,c.cart_id,cp.cart_product_id,p.product_id, p.product_name,p.product_price,cp.product_quantity,c.purchased,p.image_file_paths
        from buyer as b
        left join cart as c
        on b.buyer_id = c.buyer_id
        left join cart_product as cp
        on c.cart_id = cp.cart_id
        left join productsandimages as p
        on cp.product_id = p.product_id
        where b.buyer_id = ? and c.purchased = "no";`

    let [cartItems] = await database.query(query, [buyer_id])

    return cartItems
}

exports.getCartItemsByBuyer = getCartItemsByBuyer
// getCartItemsByBuyer(1).then(console.log)
// getCartItemsByBuyer(3).then(console.log)



async function getCartItemsLength(buyer_id) {
    let cartItems = await getCartItemsByBuyer(buyer_id)
    // console.log("bew",cartItems)
    let cartQuantity = 0
    cartItems.forEach(item => {
        cartQuantity = cartQuantity + item.product_quantity

    })
    return cartQuantity
}

exports.getCartItemsLength = getCartItemsLength
// getCartItemsLength(1).then(console.log)



async function getCartItemByProduct(buyer_id, product_id) {
    let query = `select cp.cart_product_id,b.buyer_id,c.cart_id,cp.cart_product_id,p.product_id, p.product_name,p.product_price,cp.product_quantity,c.purchased,p.image_file_paths
        from buyer as b
        left join cart as c
        on b.buyer_id = c.buyer_id
        left join cart_product as cp
        on c.cart_id = cp.cart_id
        left join productsandimages as p
        on cp.product_id = p.product_id
        where b.buyer_id = ? and p.product_id = ? and c.purchased = "no";`

    let [cartItem] = await database.query(query, [buyer_id, product_id])
    return cartItem[0]
}
exports.getCartItemByProduct = getCartItemByProduct
// getCartItemByProduct(1,1).then(console.log)

async function getCartItemsLength(buyer_Id) {
    let cartItems = await getCartItemsByBuyer(buyer_Id)
    let cartQuantity = 0
    cartItems.forEach(item => {
        cartQuantity = cartQuantity + item.product_quantity
    })
    return cartQuantity
}
exports.getCartItemsLength = getCartItemsLength
// getCartItemsLength(1).then(console.log)


async function inCartItem(cart_product_id, buyer_id, product_id) {
    // let cartItem = getCartItemByProduct(buyer_id, product_id)
    let query = `UPDATE cart_product SET product_quantity = product_quantity + 1 WHERE cart_product_id = ?`
    await database.query(query, [cart_product_id])
    return await getCartItemByProduct(buyer_id, product_id)
}
exports.inCartItem = inCartItem
// inCartItem(8,1).then(console.log)

async function deCartItem(cart_product_id, buyer_id, product_id) {
    let query = `UPDATE cart_product SET product_quantity = product_quantity - 1 WHERE cart_product_id = ?`
    await database.query(query, [cart_product_id])
    return await getCartItemByProduct(buyer_id, product_id)
}
exports.deCartItem = deCartItem


async function deleteCartItem(cart_product_id, buyer_id) {
    let query = `DELETE FROM cart_product WHERE cart_product_id = ?`
    await database.query(query, [cart_product_id])
    return
}
exports.deleteCartItem = deleteCartItem



async function completeCartAfterOrder(buyerId) {
    let cart_id = await getCartIdByBuyerId(buyerId);
    let query = `UPDATE cart SET cart.purchased = "yes" WHERE cart_id = ?`
    await database.query(query, [cart_id])
}
exports.completeCartAfterOrder = completeCartAfterOrder
// completeCartAfterOrder(3).then(console.log)



async function createOrderAfterPayment(cart_id, totalAmount, stripePaymentId, fullAddress, deliveryfee) {

    let query = 'INSERT INTO `order`(cart_id, totalAmount, stripe_payment_id, delivery_address, deliveryfee) VALUE(?, ?, ?, ?, ?)'
    let [creatNewOrder] = await database.query(query, [cart_id, totalAmount, stripePaymentId, fullAddress, deliveryfee])
    let order_id = creatNewOrder.insertId
    return order_id
}
exports.createOrderAfterPayment = createOrderAfterPayment
// createOrderAfterPayment(3,50,"dfdrgtfghdf","eded",10).then(console.log)



//=========wishlist===============



//get wishlist ID: if no exist wishlist ,then create one and return the wishlist_id
async function getWishlistIdbyBuyerId(buyer_id) {

    let queryOne = `Select wishlist_id from wishlist WHERE buyer_id = ?`
    let [getWishlistId] = await database.query(queryOne, [buyer_id])
    let wishlist_id = getWishlistId[0].wishlist_id

    if (!wishlist_id) {
        let queryTwo = `INSERT INTO wishlist(buyer_id, quantity) VALUE(?, ?)`
        let [createWishlist] = await database.query(queryTwo, [buyer_id, 1])
        let newWishlist_id = createWishlist.insertId
        return newWishlist_id
    } else {
        return wishlist_id
    }
}

exports.getWishlistIdbyBuyerId = getWishlistIdbyBuyerId
// getWishlistIdbyBuyerId(1).then(console.log)



//checking if iterm exist in the wishlist already,and return the item
async function getItemInWishlistProduct(buyer_id, product_id) {
    let wishlist_id = await getWishlistIdbyBuyerId(buyer_id);

    let querySelect = ` SELECT * FROM wishlist_product WHERE wishlist_id = ? AND product_id = ?`
    let [wishlistItem] = await database.query(querySelect, [wishlist_id, product_id])
    return wishlistItem
}
exports.getItemInWishlistProduct = getItemInWishlistProduct
// getItemInWishlistProduct(3, 6).then(console.log)


// if the item is not in the wishlist ,add it into the wishlist_product table and upate the wishlist quantity in wishlist table
async function addToWishlist(buyer_id, product_id) {

    let wishlistItem = await getItemInWishlistProduct(buyer_id, product_id)
    let wishlist_id = await getWishlistIdbyBuyerId(buyer_id);

    if (!wishlistItem.length) {
        let queryInsert = `INSERT INTO wishlist_product(wishlist_id, product_id) VALUE(?,?)`
        await database.query(queryInsert, [wishlist_id, product_id])

        let quetyUpdate = `UPDATE wishlist Set quantity = quantity +1 WHERE wishlist_id = ?`
        await database.query(quetyUpdate, [wishlist_id])
        return true
    } else {
        return false
    }

}
exports.addToWishlist = addToWishlist

async function getAllWishlistByBuyer(buyer_id) {
    let wishlist_id = await getWishlistIdbyBuyerId(buyer_id);

    let query = `SELECT w.wishlist_product_id, w.wishlist_id, w.product_id, p.product_name, p.product_price, s.store_name,s.store_id, ph.photo_file_path
                 from wishlist_product as w
                 left join product as p
                 on w.product_id = p.product_id
                 left join store as s
                 on p.store_id = s.store_id
                 left join product_photo as ph
                 on p.product_id = ph.product_id 
                 where w.wishlist_id = ?;`

    let [allWishlist] = await database.query(query, [wishlist_id])
    return allWishlist
}

exports.getAllWishlistByBuyer = getAllWishlistByBuyer
// getAllWishlistByBuyer(1).then(console.log)


async function deleteWishlistItem(wishlist_product_id) {
    let query = `DELETE FROM wishlist_product WHERE wishlist_product_id = ?`
    await database.query(query, [wishlist_product_id])
    return
}
exports.deleteWishlistItem = deleteWishlistItem





//=======searching =============

async function searchProduct(searchedString) {

    let query = `SELECT productsandimages.*
    FROM productsandimages
    WHERE product_name LIKE CONCAT("%", ?, "%") OR product_category LIKE CONCAT("%", ?, "%");
   `

    let [searchResult, fields] = await database.query(query, [searchedString, searchedString])
    return searchResult

}
exports.searchProduct = searchProduct
// searchProduct("s").then(console.log)


//=============Buyer=============

async function addBuyer(buyer_name, buyer_lastname="", buyer_phone_number, buyer_email, buyer_password) {
    let query = `
    INSERT INTO buyer (buyer_firstname, buyer_lastname, buyer_phone_number, buyer_email, buyer_password) 
    VALUES ( ?, ?, ?, ?, ?);`;

    let newBuyerInfo = await database.query(query, [buyer_name, buyer_lastname, buyer_phone_number, buyer_email, buyer_password]);
    let newBuyerId = newBuyerInfo[0].insertId

    // console.log(newStoreId)
    return getBuyer(newBuyerId)
}
exports.addBuyer = addBuyer



// -----------------------------//Chat FUNCTIONs Needed----------------------------------------------


async function chatExist(buyerId, storeId) {
    let query  = `
   
    SELECT * FROM localscoop.chat
    WHERE chat.buyer_id = ? AND chat.store_id = ?;
   `
    let [theChat, fields] = await database.query(query, [buyerId, storeId])
    console.log("chatExist: ",theChat.length === 1)
    return theChat.length === 1
    

}
exports.chatExist = chatExist
// chatExist(1,3).then(console.log)



async function createChat(buyerId, storeId) {
    let query  = `
    INSERT INTO chat (chat_name, buyer_id, store_id)
    VALUES (?, ?, ?);`

    await database.query(query, [buyerId.toString()+ storeId.toString(),buyerId, storeId])
    console.log("chat has been created")

}

exports.createChat = createChat






async function getChat(buyerId, storeId) {
    let query  = `
    SELECT * FROM localscoop.chat
    WHERE chat.buyer_id = ? AND chat.store_id = ?;
   `
    let [theChat, fields] = await database.query(query, [buyerId, storeId])
    return theChat[0]
}
exports.getChat = getChat




async function getBuyerChats(buyerId) {

    let query=`
    SELECT chat.* , storesandimages.store_name, storesandimages.image_file_paths
    FROM chat
    JOIN store ON chat.store_id = store.store_id
    JOIN storesandimages ON store.store_id=storesandimages.store_id
    WHERE chat.buyer_id = ?;`

    let [buyerChat, fields] = await database.query(query, [buyerId])
    return buyerChat

}
exports.getBuyerChats = getBuyerChats



async function getStoreChats(storeId) {
    let query= `
    SELECT chat.* , buyer.buyer_firstname, buyer.buyer_profile_photo
    FROM chat
    LEFT JOIN buyer ON chat.buyer_id = buyer.buyer_id
    WHERE chat.store_id = ?`

    let [storeChat, fields] = await database.query(query, [storeId])
    return storeChat
}

exports.getStoreChats = getStoreChats




async function chatUsersName(groupId) {

    let query =`select chat.chat_id , buyer.buyer_firstname AS "buyerName", store.store_name AS "storeName"
    from chat
    left join buyer
    on chat.buyer_id = buyer.buyer_id
    left join store
    on chat.store_id = store.store_id
    where chat_id= ?`

    let [chatUsers, fields] = await database.query(query, [groupId])
    return chatUsers[0]

}
exports.chatUsersName = chatUsersName
// chatUsersName(1).then(console.log)



async function addStoreChatContent(chatId, msgObj) {

    let query  = `
    INSERT INTO store_messages (chat_id, text, timestamp)
    VALUES (?,?,?);`

        await database.query(query, [chatId, msgObj.msg, msgObj.timestamp])

}

exports.addStoreChatContent = addStoreChatContent




async function addBuyerChatContent(chatId, msgObj) {

    let query  = `
    INSERT INTO buyer_messages (chat_id, text, timestamp)
    VALUES (?,?,?);`

    await database.query(query, [chatId, msgObj.msg, msgObj.timestamp])

}

exports.addBuyerChatContent = addBuyerChatContent




async function getStoreIdFromProductId (productId) {

    let query  = `
    SELECT store_id FROM localscoop.product
     WHERE product_id = ?;`

    let [storeIdObject, fields] = await database.query(query, [productId])
    return storeIdObject[0].store_id

}

exports.getStoreIdFromProductId = getStoreIdFromProductId
// getStoreIdFromProductId(3).then(console.log)


async function getChatContent(chatId) {

    let query  =
    
             ` select buyer_messages.buyer_messages_id as id, buyer_messages.text, buyer_messages.timestamp,  buyer.buyer_firstname as username
                FROM buyer_messages 
                JOIN chat on chat.chat_id = buyer_messages.chat_id
                JOIN buyer ON buyer.buyer_id = chat.buyer_id
                WHERE chat.chat_id = ?
                UNION
                select store_messages.store_messages_id as id, store_messages.text, store_messages.timestamp,  store.store_name as username
                FROM store_messages 
                JOIN chat on chat.chat_id = store_messages.chat_id
                JOIN store ON store.store_id = chat.store_id
                WHERE chat.chat_id = ?  
                ORDER BY timestamp asc;`
             

    let [AllChats, fields] = await database.query(query, [chatId, chatId])
    return AllChats

}


exports.getChatContent = getChatContent

// getChatContent(2).then(console.log)






//showing chat  users names, ids and their photos 
async function getChatUserinfo(chatId) {

    let query  =
        ` select chat.chat_id as chat_id, chat.buyer_id, buyer.buyer_firstname AS "buyer_name" , buyer.buyer_profile_photo AS "buyer_image",  
            chat.store_id, storesandimages.store_name AS "store_name", storesandimages.image_file_paths AS "store_images"
            FROM chat 
            JOIN storesandimages on storesandimages.store_id = chat.store_id 
            JOIN buyer ON buyer.buyer_id = chat.buyer_id
            WHERE chat.chat_id = ?`

    let [chatUserInfo, fields] = await database.query(query, [chatId])
    return chatUserInfo
}
exports.getChatUserinfo = getChatUserinfo
// getChatUserinfo(2).then(console.log)



async function getLastMessage(chatId) {
    let query  =
        ` select buyer_messages.buyer_messages_id as id, buyer_messages.text, buyer_messages.timestamp,  buyer.buyer_firstname as username
            FROM buyer_messages
            JOIN chat on chat.chat_id = buyer_messages.chat_id
            JOIN buyer ON buyer.buyer_id = chat.buyer_id
            WHERE chat.chat_id = ?
            UNION
            select store_messages.store_messages_id as id, store_messages.text, store_messages.timestamp,  store.store_name as username
            FROM store_messages
            JOIN chat on chat.chat_id = store_messages.chat_id
            JOIN store ON store.store_id = chat.store_id
            WHERE chat.chat_id = ?
            ORDER BY timestamp Desc
            Limit 1;`

    let [lastMessage, fields] = await database.query(query, [chatId])
    return lastMessage

}
exports.getLastMessage = getLastMessage
// getChatUserinfo(2).then(console.log)


















// async function getCartItemByProduct(buyer_Id, product_id) {
//     let query = `select cp.cart_product_id,b.buyer_id,c.cart_id,cp.cart_product_id,p.product_id, p.product_name,p.product_price,cp.product_quantity,c.purchased,p.image_file_paths
// from buyer as b
// left join cart as c
// on b.buyer_id = c.buyer_id
// left join cart_product as cp
// on c.cart_id = cp.cart_id
// left join productsandimages as p
// on cp.product_id = p.product_id
// where b.buyer_id = ? and p.product_id = ? and c.purchased = "no";`

//     let [cartItem] = await database.query(query, [buyer_Id,product_id])
//     return cartItem[0]
// }
// exports.getCartItemByProduct = getCartItemByProduct
// getCartItemByProduct(1,1).then(console.log)

/***   Maps  */

async function storesAndCategoryNames(){
    let query = `
        SELECT store.store_id, 
        store.store_name, store.store_address, 
        store.store_phone_number, store.rating, 
        store.coordinates, category.category_name
        FROM store
        LEFT JOIN store_category ON store.store_id = store_category.store_id
        LEFT JOIN category ON store_category.category_id = category.category_id`

    let result =  await database.query(query)
    console.log(result[0] + '\n')
    return result[0]
}
exports.storesAndCategoryNames = storesAndCategoryNames

