
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
	
		attributes.append(name, nameValue, price, priceValue,quantity, quantityValue, description, descriptionValue,  edit);
		
		ret.append(image,attributes);
		
		productPlusEdit.append(ret);
		
		document.getElementById("product-dashboard").appendChild(productPlusEdit);
		
	}

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
//if not, then it will display "Not Logged In!"
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


	if(logStatus == "false"){
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