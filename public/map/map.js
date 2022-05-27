
let map;

/**
 * @param {object} props 
 * takes an object with keys:
 * 'coords': {lat: 49.0321, lng: -123.1222}
 * 'icon': <icon url goes here>
 * 'content': html string of what to display
 */
function addMarker(props) {
	let infoWindow;

	let marker = new google.maps.Marker({
		position: props.coordinates,
		map: map,
	});

	// if custom icon exists, set icon
	if (props.icon) {
		marker.setIcon(props.icon)
	}

	// check if there is custom content for the marker
	if (props.content) {
		infoWindow = new google.maps.InfoWindow({
			content: props.content
		})
	}

	marker.addListener('click', () => {
		infoWindow.open(map, marker)
	})
}


// google maps API will call this automatically
function initMap() {
	let options = {
		zoom: 10,
		center: { lat: 49.2827, lng: -123.1207 },
	}

	map = new google.maps.Map(document.getElementById("map"), options);

	// ajax request to get the store data
	fetch("/map/get_store_info", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
	})
		.then(function (response) {
			return response.json();
		})
		.then((storeMarkerData) => {
			
			// loop through all the storesMarkerData, add marker
			for (let storeIndex of storeMarkerData){
				addMarker(storeIndex)
			}
		})

		window.initMap = initMap;
	}
	