const tagline = document.getElementById("header");

tagline.addEventListener("click", alphaMode);

function alphaMode(){
	
	tagline.style.color = "Black";
	tagline.textContent = "ALPHA XPRESS";
	
}

let press = document.getElementById("button");

press.addEventListener("click", alphaMode);