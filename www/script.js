
let userNameMessage = "not logged in";
let admin = false;

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
		//Setting up product image, name, price, and description
		var $grid = $("#product");
		var $img = $("<img>");
		$img.addClass("product-image");
		var $prod = $("<div></div>"); 
		var $prodName = $("<span>" + data.title + "</span>");
		$prodName.addClass("product-name");
		var $prodPrice = $("<span>" + " Price: $" + data.price + "</span>");
		$prodPrice.addClass("product-price");
		var $prodDesc = $("<span>" + data.description + "</span>");
		$prodDesc.addClass("product-description");
		//Styling product image, name, price, and description
		$img.attr("src", "../img/" + data.img_name);
		$img.attr("alt", data.alt);
		$img.css({
			"grid-column": 1,
			"width": "500px",
			"height": "500px",
			"float": "left",
			"border": "solid black 2px",
			"margin-bottom": "0em",
			"margin-left": "1em"
		});
		$prod.css({
			"grid-column": 2,
			"height": "500px",
			"width": "auto", 
			"position": "relative",
			"border": "solid black 2px",
			"margin-top": "1em",
		});
		$prodName.css({
			"margin": "0px",
			"margin-top": "1.5em",
			"align-items": "flex-start",
			"justify-content": "flex-start",
			"color": "black"
		});
		$prodPrice.css({
			"justify-content": "flex-start",
			"color": "black"
		});
		$prodDesc.css({
			"position": "absolute",
			"bottom": "0px",
			"color": "black"
		});
		
		//Append all 4 elements to grid
		$grid.append($img);
		$prod.append($prodName);
		$prod.append($prodPrice);
		$prod.append($prodDesc);
		$grid.append($prod);

		//Only done if the product has a review, as not all products have reviews :(
		if(data.review != null){
			var $prodRev = $("<div></div>");
			var $review = $("<span>" + data.review + "</span>");
			$review.addClass("review");
			$prodRev.css({
				"grid-row" : 2,
				"grid-column": "span 2",
				"min-height": "100px",
				"overflow": "hidden",
				"border": "solid black 2px"
			});
			$review.css("margin-top", "0px");
			$prodRev.append($review);
			$grid.append($prodRev); 
		}

		$("#product-footer").css("bottom", "0px");
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
	
	for(var i = 0; i < 5;i++){
		var ret = document.createElement("div");
		ret.setAttribute("class", "product-link");
		var image = document.createElement("img");
		var i_name =productsJson[i].img_name; 
		image.src = "../img/"+productsJson[i].img_name;
		image.alt = productsJson[i].alt;
		image.width = 200;
		image.height = 100;
		
		var prodLink = document.createElement("a");
		prodLink.href = "../pages/product-page.html?img_name="+i_name;
		prodLink.innerText = productsJson[i].title;
		
		ret.append(image,prodLink);
	
		document.getElementById("product-content").appendChild(ret);

	}
	
}

//Dynamically generates a grid for the products in the database.
async function shoppingGrid(){
	/*
		get json results of 1 random product from database
		parse the json for image name, alt tag, and title

		then add product to dynamically generated grid
	*/
	var productsJson = await getProducts();

	var index = 0; //productsJson product index
	var gridTempRow = ""; //Used later for css styling - grid-template-rows
	var gridTempCol = ""; //Used later for css styling - grid-template-columns
	var numRows = Math.floor(Math.sqrt(productsJson.length)); //Number of rows dependent upon how many products we have
	var $div = $(".shopping-grid");
	for (let row = 1; row <= numRows; row++){
		gridTempRow += "300px "; //Adds depending on the # of rows
		for (let col = 1; col <= (productsJson.length / numRows); col++, index++){ //Number of colums dependent on how many rows
			//Adding each product to grid and doing styling for all
			var $prod = $("<div></div>");
			$prod.addClass("product-link");
			var $img = $("<img>");
			var i_name =productsJson[index].img_name; 
			$img.attr("src", "../img/"+i_name);
			$img.attr("alt", productsJson[index].alt);
			$img.css("width", "200");
			$img.css("height", "200");
			$img.css("border", "solid black 3px");
			
			var $prodLink = $("<a>");
			$prodLink.attr("href", "../pages/product-page.html?img_name="+i_name);
			$prodLink.html(productsJson[index].title);
			
			$prod.append($img);
			$prod.append($prodLink);
			$prod.css("grid-row", row);
			$prod.css("grid-column", col);
			$div.append($prod);
		}
	}

	for (let i = 0; i < (productsJson.length / numRows); i++){
		gridTempCol += "300px "; //Adds depending on the # of columns
	}

	$(".shopping-grid").css("grid-template-rows", gridTempRow.trim());
	$(".shopping-grid").css("grid-template-columns", gridTempCol.trim());
	
	/*

	Old function version - non-grid format

	for(var i = 0; i < productsJson.length;i++){
		var $div = $(".product-grid");
		var $prod = $("<section></section>");
		$prod.addClass("product-link")
		//$div.addClass("product-grid");
		var $img = $("<img>");
		var i_name =productsJson[i].img_name; 
		$img.attr("src", "../img/"+i_name);
		$img.attr("alt", productsJson[i].alt);
		$img.css("width", "200");
		$img.css("height", "200");
		
		var $prodLink = $("<a>");
		//$prodLink.addClass("product-link");
		$prodLink.attr("href", "../pages/product-page.html?img_name="+i_name);
		$prodLink.html(productsJson[i].title);
		
		$prod.append($img);
		$prod.append($prodLink);
		$div.append($prod);

		$("#product-content").append($div);

	}
	*/
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
	
		attributes.append(name, nameValue, price, priceValue,quantity, quantityValue, description, descriptionValue,  edit);
		
		ret.append(image,attributes);
		
		productPlusEdit.append(ret);
		
		document.getElementById("product-dashboard").appendChild(productPlusEdit);
		
	}

}

async function createGrid(){
	
	var productsJson = await getProducts();


}

function editProduct(e){
	var form = document.getElementById("productEditor");
	form.style.visibility = "visible";
	
	var inputs = document.getElementById('productEditor').children;
	
	var parent = e.target.parentNode;
	var child = parent.children;

	var name = child.item(1).innerText;
	inputs.item(1).defaultValue = name;
	inputs.item(8).value = name;//hidden field in case we want to change the product name
	
	var price = child.item(3).innerText;
	inputs.item(3).defaultValue = price;
	
	var quant = child.item(5).innerText;
	inputs.item(5).defaultValue = quant;
	
	var desc = child.item(7).innerText;
	inputs.item(7).defaultValue = desc;

	
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
//Logons are the following:
//user@gmail.com | user1
//admin@gmail.com | admin1
async function  validateLogin(){

	var e = document.getElementById("accountEmail").value;
	var p = document.getElementById("accountPassword").value;
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
	});
		var user_type = await getUserType(e)
		console.log(user_type);
		createCookies(e, p, user_type);
			
		userNameMessage = e;
		if(user_type == 'user'){
			window.location.replace("http://localhost:3000/");	
		}
		else if(user_type == 'admin'){
			window.location.replace("http://localhost:3000/admin");	
		}
		else throw new Error("Unknown User Type!");
		
}
async function getUserType(user_email){
	var user_type
	const response = await fetch("http://localhost:3000/validateLogin/"+user_email,{
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(response =>response.json()).then(data =>{
		user_type = data[0].user_type;
	});
	return user_type;
}

function createCookies(email, password,userType){ 
	//create email cookie and sessionID cookie 
	//session only lasts 30 minutes 
	var now = new Date(); var minutes = 30; 
	now.setTime(now.getTime() + (minutes * 60 * 1000)); 
	document.cookies = "logStatus=true;"
	document.cookie = "email=" + email + "; expires=" + now.toGMTString() + ";";
	document.cookie = "password=" + password +"; expires=" + now.toGMTString() + ";"; 
	document.cookie = "userType=" + userType +"; expires=" + now.toGMTString() + ";";


}

//this should extend the session of user if the user logs in again with active session
function extendSession(){
	
	
}
//displays the email address to the user if they have already been logged in and there session is still active,
//if not, then it will display nothing
function displayUserName(){
	
	const userName = document.getElementById("userName");

	if(checkCookie("email")){
	
		userName.innerHTML = getCookie("email");
	
	}
	else{
	
		userName.innerHTML = "";
	}
}

function displayLogStatus(){
	
	var logStatus = getLogStatus();

	if(logStatus != "true" || logStatus == "false"){
		document.getElementById("logStatus").innerText = "Login";

	}
	else{
		document.getElementById("logStatus").innerText = "Logoff";

	}

}


function getCookie(value){
	var cookieString = document.cookie.substr(document.cookie.indexOf(value));
	
	if( cookieString.indexOf(";") == -1){
		var cookieValue = cookieString.substring(cookieString.indexOf("=") + 1, cookieString.length);
	}
	else{
	var cookieValue = cookieString.substring(cookieString.indexOf("=") + 1, cookieString.indexOf(";"));
	}
	return cookieValue;
	
}


function getLogStatus(){
	var cookieString = document.cookie.substr(document.cookie.indexOf("logStatus"));
	var cookieValue;
	if( cookieString.indexOf(";") == -1){
		cookieValue = cookieString.substring(cookieString.indexOf("=") + 1, cookieString.length);
	
	}
	else{
		cookieValue = cookieString.substring( cookieString.indexOf("=") + 1,cookieString.indexOf(";"));
	}
	return cookieValue;
	
}


function checkCookie(value){
	const startingIndex = document.cookie.indexOf(value);
	
	if(startingIndex === -1){

		return false;
		
	}
	else{
		return true;
	}
	
}

function autoLogin(){
	
	if(checkCookie("email")){

	var loginForm = document.getElementById("loginForm");
	var formInputs = loginForm.children;
	
	formInputs[2].defaultValue = getCookie("email");
	formInputs[6].defaultValue = getCookie("password");

	formInputs.submit();

	}
	else{
		
	}
	
}

 function isAdmin(){
			
		if(!checkCookie("userType")){
		}
		else{
			const userType = getCookie("userType");
			
			if(userType === "admin"){
				document.getElementById("admin").style.display = "inline";
				
			}
			else{
				
			}
			
		}

	
}