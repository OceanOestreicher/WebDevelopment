const tagline = document.getElementById("header");

let userNameMessage = "not logged in";

//tagline.addEventListener("click", alphaMode);

function alphaMode(){
	
	tagline.style.color = "Black";
	tagline.textContent = "ALPHA XPRESS";
	
}

async function generateProductInfo(){
	const urlParams = new URLSearchParams(window.location.search);
	var data;
	console.log(urlParams.get("img_name"));
	var response = await fetch("http://localhost:3000/productPage/" + urlParams.get("img_name"), {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}})
	.then((response) => response.json())
	.then((d) => {
		data = d[0]
		console.log(data);
	});
		var ret = document.createElement("div");
		var image = document.createElement('img');
		image.src = "../img/" + data.img_name;
		console.log(image.src);
		console.log(data.img_name);
		image.alt = data.alt;
		image.width = 500;
		var prodInfo = document.createElement("p");
		var prodDesc = data.description;
		prodInfo.innerText = data.title + " Price : $" + data.price + " Quantity: " + data.quantity;
		ret.append(image, prodInfo, prodDesc);
		document.getElementById('product-info').appendChild(ret);
}

async function getProductCards(){
	/*
		get json results of 1 random product from database
		parse the json for image name, alt tag, and title

		then construct 1 product container for each result

			    <div class="product-container">
					<div class="product-link">
					<img src="img/bull-testicles.jpg"  alt="Bull Testicle Supplements">
					<a href="pages/product-page.html">Bull: Grass-Fed Beef Testicle (Orchic)<a>
				</div>
	*/
	var productsJson = await getProducts();
	
	for(var i = 0; i < productsJson.length;i++){
		var ret = document.createElement("div");
		ret.setAttribute("class", "product-link");
		var image = document.createElement("img");
		var i_name =productsJson[i].img_name; 
		image.src = "img/"+productsJson[i].img_name;
		image.alt = productsJson[i].alt;
		
		var prodLink = document.createElement("a");
		prodLink.href = "pages\/product-page.html?img_name="+i_name;
		prodLink.innerText = productsJson[i].title;
		
		ret.append(image,prodLink);
	
		document.getElementById("product-content").appendChild(ret);

	}
	
	 
}

async function getAllProduct(){

	var productsJson = await getProducts();
	
	for(var i = 0; i < productsJson.length;i++){
		
		var productPlusEdit = document.createElement("div")
		productPlusEdit.setAttribute("class", "productEdit");
		
		var ret = document.createElement("div");
		ret.setAttribute("class", "product-info");
		var image = document.createElement("img");
		var i_name =productsJson[i].img_name; 
		image.src = "../img/"+productsJson[i].img_name;
		image.alt = productsJson[i].alt;
		image.height = "300";
		image.width = "300";
		
		var attributes = document.createElement("div");
		attributes.setAttribute("class", "product-attributes");
		
		var description = document.createElement("label");
		description.innerText = "Description: "
		var descriptionValue = document.createElement("p");
		descriptionValue.innerText = productsJson[i].description;
		
		var price = document.createElement("label");
		price.innerText = "Price: ";
		var priceValue = document.createElement("p");
		priceValue.innerText = productsJson[i].price;
		
		var quantity = document.createElement("label");
		quantity.innerText = "Quantity: ";
		var quantityValue = document.createElement("p");
		quantityValue.innerText = productsJson[i].quantity;
		
		var name = document.createElement("label");
		name.innerText = "Product Name: ";
		var nameValue = document.createElement("p");
		nameValue.innerText = productsJson[i].title;
		
		var edit = document.createElement("button");
		edit.innerText = "edit";
		edit.setAttribute("class", "button");
		
		edit.addEventListener("click", editProduct);
	
		attributes.append(name, nameValue, price, priceValue, description, descriptionValue, quantity, quantityValue, edit);
		
		ret.append(image,attributes);
		
		productPlusEdit.append(ret);
		
		document.getElementById("product-dashboard").appendChild(productPlusEdit);
		
	}

}

function editProduct(e){
	document.getElementById("productEditor").style.visibility = "visible";
	
	var parent = e.target.parentNode;
	var child = parent.children;
	
	var child1 = child.item(1);
	
	alert(child1.innerText);
	
}

async function  getProducts(){
	const response = await fetch("http://localhost:3000/getProducts", {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
  		'Content-Type': 'application/json'
	}
}).catch((error)=>{
	console.error('Error:',error);
})
return response.json();
}

//Fetch Api, login form frontend validation function
async function  validateLogin(){

	var e = document.getElementById("accountEmail").value;
	var p = document.getElementById("accountPassword").value;
	console.log("Frontend: "+e + " "+p);
	const data = {email: e,
				   password: p };
	const response = await fetch("http://localhost:3000/validateLogin", {
	method: 'POST',
	headers: {
		'Accept': 'application/json',
  		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data),
}).then(response => {
	if(response.status == 400){
		document.getElementById("error-Message").innerText = ("Invalid Credentials Entered");
		return false;
	} 
	else{
		//creates email cookie and sessionID cookie
		createCookies(e);
		userNameMessage = e;
		window.location.replace("http://localhost:3000/");
	} 
});
}

function createCookies(email){ 
	//create email cookie and sessionID cookie 
	//session only lasts 30 minutes 
	var now = new Date(); var minutes = 30; 
	now.setTime(now.getTime() + (minutes * 60 * 1000)); 
	document.cookie = "email=" + email + "; expires=" + now.toGMTString() + ";"; 
	document.cookie = "sessionID=" + Math.random() * 100  + "; expires=" + now.toGMTString() + ";"; 
	//alter database to store sessionID so that it can be used to match against stored cookie 

}

//this function should be called when the user logs out
function deleteCookies(){
	document.cookie = "email= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
	document.cookie = "sessionID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}

//checks if the computer has the cookies from a previous session so it knows to display the email address
function checkCookies(){
	let cookies = document.cookie;
	const cookiesPair = cookies.split(';');
	
	if(cookiesPair.length === 1){
		return false;
	}
	
	const firstCookie = cookiesPair[1];
	
		if(firstCookie.substr(0,6).trim() === "email"){
			return true;

		}
		else{
			return false;
		}
}

//this should extend the session of user if the user logs in again with active session
function extendSession(){
	
	
}
//displays the email address to the user if they have already been logged in and there session is still active,
//if not, then it will display "Not Logged In!"
function displayUserName(){
	
	const userName = document.getElementById("userName");
	let cookies = document.cookie;
	const emailCookie = cookies.split(';');
	
	if(checkCookies()){
	userName.innerHTML = emailCookie[1].substring(7);
	
	}
	else{
		userName.innerHTML = "Not Logged In!";
	}
}