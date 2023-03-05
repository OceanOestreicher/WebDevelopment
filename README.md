Readme
AlphaXpress Group Project

Readme for project updates or changes

January 16th-20th (Week 2)
Researched ten websites in order to see what common features are in them. This way we can better plan out our design, how we structure our code, and what API/libraries to use.
We also designated someone as our designer for the website.

January 23rd-27th (Week 3)
All members of team have assigned roles. Johanne is the project manager, Ian and Ocean are back end developers, Dominic is the front end developer, and Artur is the web designer.
Artur has started working on designing how the website will look using Figma.

January 30th-February 3rd (Week 4)
Ocean did a lot of research on backend and set up GitHub so we can pull it into Laragon and run it seamlessly. Johanne created a prototype of homepage in HTML, CSS, and JS. Arthur is creating media assets for website as well as designing the website UX Discussed how we want to structure our database for backend. 

February 6th-10th (Week 5)
Added account, shopping, cart, about us, and testimonials pages in pages file that stores auxiliary pages. Arthur created media that is now being used to build homepage. Johanne linked Homepage to Account page. Ocean linked front-end to back-end using Node.js. Account Page has two input fields that can interface with a server now. WCAG pressentation is fully done with Ian, Ocean, Johanne, and Arthur as speakers; Dominic will demostrate the website to the class as of 02.12.2023.

February 13th-17th (Week 6)
All page's nav bars now functionally link to each other. Home page is finished besides adding more top products and other stylistic changes. Ocean and Ian worked on back-end server and database. They made it so you can dynamically generate products dispayed in the "top products" section of homepage. Product's alt tag, iamge source, and name are stored in a database now. Johanne altered server.js to make the generation of products work bettter.

February 20th-24th (Week 7)
Ocean implemented logging and logging off through the website. Group set a plan for what we will be doing for next week. Ian added price, quantity, description, reviews to the products table, Johanne added simple Cookies to the website for displaying user's email and keeping track of active sessions.

February 27th-March 4th (Week 8)
Notes: Ocean and Dominic implemented dynamic product pages for displaying our products. Ocean fixed GitHub so that unnecessary files werent be uploaded, implemented admin and user account types and redirection, removed reviews from product table. Johanne and Artur created the admin dashboard. Johanne implemented JQuery throughout the project

Setup For Using Laragon Install As Local Repository

1. Have a fresh Laragon install

2. Navigate to the folder in cmd. You should see all the sub-folders such as www, tmp, etc.

3. Run the following commands:

	- git init
	- git checkout -b main
	- git remote add origin https://github.com/OceanOestreicher/WebDevelopment.git
	- git pull origin main
	- git branch -u origin/main
	
To Use Everything

	-Start the mySql server(Right click on laragon, MySql, Start MySql
	-Open the terminal in laragon and navigate to the node folder
	-run Node server.js
	-on your browser type localhost:3000/

