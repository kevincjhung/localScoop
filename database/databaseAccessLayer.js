

/** database setup */
const res = require("express/lib/response");
const mysql = require("mysql2")
const is_heroku = process.env.IS_HEROKU || false;
let database;

const dbConfigHeroku = {
    host: "ckshdphy86qnz0bj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "hct0x5slkt8i1bgn",
    password: "o9dc7b1zw1ho9812",
    database: "ht3fknlbys0qeor5",
    multipleStatements: false,
    namedPlaceholders: true
};


//YASMINA's localHost

/* change this so it matches yours */
const dbConfigLocal = {
	host: "localhost",
	user: "root",
	password: "Fswd2021$",
	database: "localscoop",
	port: 3306,
	multipleStatements: false,
	namedPlaceholders: true
};


// KEVIN's localHost

// const dbConfigLocal = {
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "localscoop-local",
//     port: 3306,
//     multipleStatements: false,
//     namedPlaceholders: true
// };


//YOYO local database

// const dbConfigLocal = {
// 	host: "localhost",
// 	user: "root",
// 	password: "Password",
// 	database: "localscoop_local",
// 	port: 3306,
// 	multipleStatements: false,
// 	namedPlaceholders: true
// };

if (is_heroku) {
    database = mysql.createPool(dbConfigHeroku).promise();
}
else {
    database = mysql.createPool(dbConfigLocal).promise();
}


/*****      Functions     *****/



/**

 * 
 * @param {number} store_id 
 * @returns all products belonging to a store


 */
// function getProductsByStoreId(store_id=1) {
//     let query = `
//     SELECT product.*, store.store_name, product_photo.photo_file_path
//     FROM product
//     LEFT JOIN store
//     ON store.store_id = product.store_id
//     LEFT JOIN product_photo
//     ON product.product_id = product_photo.product_id
//     WHERE store.store_id = ?
//     `

//     return database.query(query, [store_id])
//         .then(([products, fields]) => {
//             // console.log(products)
//             return products

//             // return products[0];
//         })
// }
// exports.getProductsByStoreId = getProductsByStoreId


 /** 
  * get all the orders by the giving store id in the order table
  * @param {number} store_id. 
  */


// function getOrdersByStoreId(store_id=1) {
//     // has to be single line. because we used a sql keyword as table name. SO we cannot use backticks to wrap the string
//     let query = "select * from `order` WHERE store_id = ?"; 

//     return database.query(query, [store_id])
//         .then((orders) => {
//             return orders[0]
//         })
// }
// exports.getOrdersByStoreId = getOrdersByStoreId


/**
 *
 * @param store_id
 * @returns {Promise<*>}
 */
async function getStoreInfoByStoreId(store_id){

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
        group by store_id 
        
         `
        
    let [store, fields] = await database.query(query,[store_id])
    return store
}
exports.getStoreInfoByStoreId = getStoreInfoByStoreId
getStoreInfoByStoreId(1).then(console.log)






//===================SHOP SETUP=========================


/**
 *
 * @param store_name
 * @param store_phone_number
 * @param store_email
 * @param store_password_hash
 * @returns {*}
 */

function addShop(store_name, store_phone_number, store_email, store_password_hash) {
    let query = `
    INSERT INTO store (store_name, store_phone_number, store_email, store_password_hash) 
    VALUES ( ?, ?, ?, ?);`;

    return database.query(query, [store_name, store_phone_number, store_email, store_password_hash]);
}
exports.addShop = addShop





/**
 *
 * @param store_id
 * @param store_address
 * @returns {Promise<*>}
 */
async function updateShopAddressByStoreId(store_id, store_address="") {

    let query = `
UPDATE store
SET store_address = ?
WHERE store.store_id  = ?;
`
    await database.query(query,[store_address,store_id])
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
    let categoryIdList =[]

    let query = `
    SELECT category.category_id
    FROM category
    WHERE category.category_name=?;
    `

    for (let categoryName of categoryNameList){
        let [idObjectOfName, fields] =  await database.query(query,[categoryName])
        let idOfName =  JSON.parse(idObjectOfName[0]['category_id'])
        categoryIdList.push(idOfName)
    }

    return categoryIdList

}
exports.getCategoryIdByCategoryName = getCategoryIdByCategoryName
// getCategoryIdByCategoryName(["beauty", "stationary", "art"]).then(console.log)


/**
 *
 * @param store_id
 * @param categoryNameList
 * @returns {Promise<*>}
 */
async function updateShopCategoryByStoreId(store_id, categoryNameList) {
    let catIdList = await getCategoryIdByCategoryName(categoryNameList)

        let query = `
         INSERT INTO store_category (store_id, category_id)
         VALUES (?, ?);
    `

    for (let catId of catIdList) await database.query(query,[store_id,catId])
    return getStoreInfoByStoreId(store_id)

}

exports.updateShopCategoryByStoreId= updateShopCategoryByStoreId
// updateShopCategoryByStoreId(1,[2, 3, 4]).then(console.log)
// updateShopCategoryByStoreId(1,["beauty", "stationary", "art"]).then(console.log)



/**
 *
 * @param store_id
 * @param delivery
 * @param pickup
 * @param radius
 * @returns {Promise<*>}
 */
async function updateShopDeliveryByStoreId(store_id, delivery=0, pickup=0, radius=null) {

    let query = `
    UPDATE store
    SET store.delivery = ?,
    store.pickup = ?,
    store.radius = ?
    WHERE store.store_id = ?;`

    await database.query(query,[delivery, pickup, radius, store_id])
    return getStoreInfoByStoreId(store_id)
}

exports.updateShopDeliveryByStoreId = updateShopDeliveryByStoreId
// updateShopDeliveryByStoreId(1,0,1,0).then(console.log)




/**
 *
 * @param store_id
 * @param photo_path
 */

async function updateShopPhotoByStoreId(store_id, photo_path="") {

    let query = `
    INSERT INTO store_photo(store_id, photo_file_path ) 
    VALUE(?, ?)`

    await database.query(query, [store_id, photo_path])
    // return getStoreInfoByStoreId(store_id)
}
exports.updateShopPhotoByStoreId = updateShopPhotoByStoreId

//---------------------------------------------------------------------------









//works for local database
 async function getAllBuyers() {
    let sqlQuery = "SELECT buyer_id, buyer_firstname, buyer_lastname, buyer_email, buyer_phone_number, buyer_gender, buyer_date_of_birth, buyer_profile_photo, buyer_address FROM buyer";
    const [AllBuyers] =  await database.query(sqlQuery);
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
    const [products] = await database.query(sqlQuery, [product_id])
    const product = products[0]
    return product
}
exports.getProductsAndImages = getProductsAndImages
// getProductsAndImages(2).then(console.log)

//works for local database
 async function addNewProduct(store_id,product_name, product_category, product_description, product_price, product_delivery_fee) { 
    let query = `INSERT INTO product(store_id,product_name, product_category, product_description, product_price, product_delivery_fee) VALUE (?, ?, ?, ?, ?, ?)`
    const [newproductInfo] = await database.query(query, [store_id, product_name, product_category, product_description, product_price, product_delivery_fee])
    return +newproductInfo.insertId
    // const  id = +newproductInfo.insertId
    // console.log(id)
    // return await getProductsAndImages(id)
}


exports.addNewProduct = addNewProduct
//addNewProduct(2,"pp", "food", "olive", 20, 10).then(console.log)



async function addNewProductPhoto(product_id, photo_file_path){
    let query = `INSERT INTO product_photo(product_id, photo_file_path ) VALUE(?, ?)`
    const newProductPhoto = await database.query(query, [product_id, photo_file_path])
    return await getProductsAndImages(product_id)
}

exports.addNewProductPhoto = addNewProductPhoto
// addNewProductPhoto(2,"dfgvdfvd444").then(console.log)






// addNewProductPhoto(4).then(console.log)



// export async function addNewProduct(store_id, product_name, product_category, product_description, product_price, product_delivery_fee, product_timestamp) {
//     let sqlQuery = `INSERT INTO product(store_id, product_name, product_category, product_description, product_price, product_delivery_fee, product_timestamp) VALUE (?, ?, ?, ?, ?, ?, ?)`
//     const [newproductInfo] = await database.query(query, [store_id, product_name, product_category, product_description, product_price, product_delivery_fee, product_timestamp])
//     const product_id = newproductInfo.insertId
//     return await getProduct(product_id)
// }


// export async function getAllProductPhotosByStoreId(store_id, product_id, photosNumber=1) {

// }





// //don't need to implement it because we don't have a edit shop page
// export async function getStoreInfoByStoreId(store_id) {


// }

// //don't need to implement it because we don't have a edit shop page
// export async function getAllProductPhotosByStoreId() {

// }


// //don't need to implement it because we don't have a edit shop page


// //don't need to implement it because we don't have a edit shop page
// export async function getAllProductPhotosByStoreId() {

// }









// export async function getAllProductPhotosByStoreId() { } //don't need to implement it because we don't have a edit shop page

// export async function getAllProductPhotosByStoreId() {} //don't need to implement it because we don't have a edit shop page



//==========copy from Patrick's lab"========


// function getAllUsers(callback) {
//     let sqlQuery = "SELECT web_user_id, first_name, last_name, email FROM web_user";
//     database.query(sqlQuery, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         }
//         else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }

// const passwordPepper = "SeCretPeppa4MySal+";

// function addUser(postData, callback) {
//     let sqlInsertSalt = "INSERT INTO web_user (first_name, last_name, email, password_salt) VALUES(:first_name, :last_name, :email, sha2(UUID(), 512)); ";
//     let params = {
//         first_name: postData.first_name, last_name: postData.last_name,
//         email: postData.email
//     };
//     console.log(sqlInsertSalt);

//     database.query(sqlInsertSalt, params, (err, results, fields) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             let insertedID = results.insertId;
//             let updatePasswordHash = "UPDATE web_user SET password_hash = sha2(concat(:password,:pepper,password_salt),512) WHERE web_user_id = :userId;"
//             let params2 = {
//                 password: postData.password,
//                 pepper: passwordPepper,
//                 userId: insertedID
//             }
//             console.log(updatePasswordHash);
//             database.query(updatePasswordHash, params2, (err, results, fields) => {
//                 if (err) {
//                     console.log(err);
//                     callback(err, null);
//                 } else {
//                     console.log(results);
//                     callback(null, results);
//                 }
//             });
//         }
//     });
// }

// function deleteUser(webUserId, callback) {
//     let sqlDeleteUser = "DELETE FROM web_user WHERE web_user_id = :userID";
//     let params = {
//         userID: webUserId
//     };
//     console.log(sqlDeleteUser);
//     database.query(sqlDeleteUser, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }



// function getAllRestaurants(callback) {
//     let sqlQuery = "SELECT restaurant_id, name, description FROM restaurant";
//     database.query(sqlQuery, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }


// function addRestaurants(postData, callback) {
//     let sqlInsertRestaurant = "INSERT INTO restaurant (name, description) VALUES(:name, :description); ";
//     let params = {
//         name: postData.name,
//         description: postData.description
//     };
//     database.query(sqlInsertRestaurant, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
//     console.log(sqlInsertRestaurant);
// }

// function deleteRestaurants(restaurant_id, callback) {
//     let sqlDeleteRestaurant = "DELETE FROM restaurant WHERE restaurant_id = :restaurant_id";
//     let params = {
//         restaurant_id: restaurant_id
//     };
//     console.log(sqlDeleteRestaurant);
//     database.query(sqlDeleteRestaurant, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }


// function getReview(restaurant_id, callback) {
//     let reviewQuery = "SELECT review_id, restaurant_id, reviewer_name, details, rating FROM review";
//     let params = {
//         restaurant_id: restaurant_id
//     };
//     database.query(reviewQuery, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }


// function getRestaurantName(restaurant_id, callback) {
//     let reviewQuery = "SELECT * FROM restaurant WHERE restaurant_id = :restaurant_id";
//     let params = {
//         restaurant_id: restaurant_id
//     };
//     database.query(reviewQuery, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }

// function addReview(postData, callback) {
//     let sqlInsertReview = "INSERT INTO review (restaurant_id, reviewer_name, details, rating) VALUES(:restaurant_id, :reviewer_name, :details, :rating); ";
//     let params = {
//         restaurant_id: postData.restaurant_id,
//         reviewer_name: postData.reviewer_name,
//         details: postData.details,
//         rating: postData.rating

//     };
//     database.query(sqlInsertReview, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
//     console.log(sqlInsertReview);
// }



// function deleteReview(review_id, callback) {
//     let sqlDeleteReview = "DELETE FROM review WHERE review_id = :review_id";
//     let params = {
//         review_id: review_id
//     };
//     console.log(sqlDeleteReview);
//     database.query(sqlDeleteReview, params, (err, results, fields) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             console.log(results);
//             callback(null, results);
//         }
//     });
// }


// module.exports = { getAllRestaurants, addRestaurants, deleteRestaurants, getReview, getRestaurantName, addReview, deleteReview}