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
	
	for(var i = 0; i < productsJson.length;i++){
		var ret = document.createElement("div");
		ret.setAttribute("class", "product-link");
		var image = document.createElement("img");
		image.src = "img/"+productsJson[i].img_name;
		image.alt = productsJson[i].alt;
		
		var prodLink = document.createElement("a");
		prodLink.href = "pages\/product-page.html";
		prodLink.innerText = productsJson[i].title;
		
		ret.append(image,prodLink);
	
		document.getElementById("product-content").appendChild(ret);

	}
	
	 
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
		alert("Invalid Credentials Entered");
		return false;
	} 
	else{
		window.location.replace("http://localhost:3000/");
	} 
});
}
