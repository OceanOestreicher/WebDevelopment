const tagline = document.getElementById("header");

//tagline.addEventListener("click", alphaMode);

function alphaMode(){
	
	tagline.style.color = "Black";
	tagline.textContent = "ALPHA XPRESS";
	
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
	var ret = "";
	for(var i = 0; i < productsJson.length;i++){
		console.log(productsJson[i].pid + " "+productsJson[i].img_name + " "+productsJson[i].alt + " "+productsJson[i].title);
		var prod = "<div class=\"itemized-item\">";
		prod += "<div class=\"product-link\">";
		prod += "<img src=\"img/"+productsJson[i].img_name+"\" alt=\""+productsJson[i].alt+"\"></div>";
		prod += "<a href=\"pages/product-page.html\">"+productsJson[i].title+"<a>"//product-page.html needs to be dynamic
		prod += "</div>";
		ret += prod;
	}
	document.getElementById("product-content").innerHTML = ret;
	 
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
}).then(response => response.json()).then(response =>{
	if(response['message'] == 'Failed'){
		alert("Invalid Credentials Entered");
		return false;
	} 
	else{
		console.log("True");
		window.location.replace("http://localhost:3000/");
		return true;
	} 
});
}
