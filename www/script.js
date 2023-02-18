const tagline = document.getElementById("header");

//tagline.addEventListener("click", alphaMode);

function alphaMode(){
	
	tagline.style.color = "Black";
	tagline.textContent = "ALPHA XPRESS";
	
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
