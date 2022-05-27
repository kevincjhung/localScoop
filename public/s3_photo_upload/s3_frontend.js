/**
 * Deprecated, front end js for s3 upload moved to inline script tag in the ejs file.
 * because it looks like every ejs file will need its own script file, as I 
 * do not know how to pass the name of the ejs file to the js file.
 */

const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")

imageForm.addEventListener("submit", async event => {
	event.preventDefault()

	console.log('s3_frontend called from product post')
	const file = imageInput.files[0]

	/**
	 * make 2 requests, 
	 * 	1st to get the s3 url. 
	 * 	2nd to send it to the backend
	 */
	let imageUrl;
	
	try {
		// get secure url from our server
		const { url } = await fetch("/s3Url").then(res => res.json())
		
		// post the image direclty to the s3 bucket
		await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "multipart/form-data"
			},
			body: file
		})

		imageUrl = url.split('?')[0]
		console.log(imageUrl)

		// post requst to my server to store any extra data
		const postParam = {
			imageUrl
		}

		console.log(postParam)

		// ajax request to routes
		await fetch("/shop_setup/uploadS3", {
			method: "POST",
			body: JSON.stringify(postParam),
			headers: {
				"Content-Type": "application/json"
			},
		})
	} catch (error) {
		console.log("ERROR", error)
	}

	// append image on document
	const img = document.createElement("img")
	img.src = imageUrl
	console.log(imageUrl)
	document.body.appendChild(img)
})