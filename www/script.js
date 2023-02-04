var blooper = document.getElementById("header");

blooper.addEventListener("click", turnBlue);

function turnBlue(){
	
	blooper.style.color = "green";
	blooper.textContent = "THIS WORKDSSSS";
	
}

let press = document.getElementById("button");

press.addEventListener("click", turnBlue);