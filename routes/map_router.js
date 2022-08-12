const help = require("../help")
const express = require("express");
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')
const axios = require("axios");
const { type } = require("express/lib/response");

// GET /map/
router.get("/", (req, res) => {
	res.render("map_router/map")

})


// AJAX-REQUEST: POST /map/get_store_info
router.post('/get_store_info',help.buyerAuthorized, async (req, res) => {

	let markerData = await mysqlDB.storesAndCategoryNames();
	

	let markerDataForFrontEnd = [];

	for (store of markerData) {
		let theContent = `
			<div style="background-color: #F7F7F3; height: 200px; width: 200px; border-radius: 10px;">	
				<h4>${store.store_name}</h4> 
				<p><b>Address:</b> ${store.store_address}</p>
				<p><b>Phone:</b> ${store.store_phone_number}</p>
				<p><b>Rating:</b> ${store.rating}</p>
				<p><b>Specialty:</b> ${store.category_name}
			</div>`

		console.log(store.coordinates)
		let coordinatesJSON = JSON.parse(`{ ${store.coordinates} }`)
		
		let pushObject = {
			coordinates: coordinatesJSON,
			content: theContent
		}
		markerDataForFrontEnd.push(pushObject)
	}
	res.status(200).send(markerDataForFrontEnd);
})

module.exports = router;

