"use strict";

const express = require("express"); // for webpage managment with NodeJS
const bodyParser = require("body-parser"); // for parsing HTTP requests and responses
const exphbs = require("express-handlebars"); // web template middleware engine
const path = require("path"); // core JS module for handling file paths
const dotenv = require("dotenv"); // set up config for ".env" file
dotenv.config();

const responsive = express(); // creating a new webpage management instance
const connection = require("./connection"); // import db connection object

// set default filepath for public resources (images, stylesheets, etc...)
responsive.use("/public", express.static(path.join(__dirname, "public")));

// Declare view engine setup
responsive.engine("handlebars", exphbs());
responsive.set("view engine", "handlebars");

// Body Parser Middleware
responsive.use(bodyParser.urlencoded({ extended: false }));
responsive.use(bodyParser.json());

// This will print HTTP request methods live as they happen
responsive.use(function (req, res, next) {
	console.log(`Request –> (Method: ${req.method}, URL: ${req.url})`);
	next();
});

// Get root (index) route and display products
responsive.get("/", function (req, res) {
	connection.query(
		"SELECT * FROM Products", // get all of the "Products" table data
		(err, results, fields) => {
			if (err) {
				// if error occurred while trying to acquire product data
				console.log(err);
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>There was an error. Please reload to try again.</p></div>`,
					layout: false,
				});
				return;
			} else if (results.length <= 0) {
				// if there are no data rows available in the "Products" table
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #aaaaaa;"><p>No products found in the database. <br/> Start adding some using the Submit link in the navigation.</p></div>`,
					layout: false,
				});
			} else {
				// aquired "Products" table data and rendered in the homepage
				res.render("index", {
					msg: "",
					layout: false,
					data: results,
				});
				return;
			}
		}
	);
});

// handles SEARCHING of products
responsive.post("/search_products", function (req, res) {
	connection.query(
		`SELECT * FROM Products WHERE ProductName LIKE "%${req.body.search_query}%"`,
		(err, results, fields) => {
			if (err) {
				// if error occurred while trying to acquire data
				console.log(err);
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>There was an error. Please reload and try again.</p></div>`,
					layout: false,
				});
				return;
			} else if (results.length <= 0) {
				// if there are no data rows, display message
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #aaaaaa;"><p>No products found with that query.</p></div>`,
					layout: false,
				});
			} else {
				// Render search results in to list in homepage
				res.render("index", {
					msg: "",
					layout: false,
					data: results,
				});
				return;
			}
		}
	);
});

// handles SORTING of products
responsive.post("/sort_products", function (req, res) {
	connection.query(
		`SELECT * FROM Products ORDER BY ProductName`,
		(err, results, fields) => {
			if (err) {
				// if error occurred while trying to acquire data
				console.log(err);
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>There was an error. Please reload and try again.</p></div>`,
					layout: false,
				});
				return;
			} else if (results.length <= 0) {
				// if there are no data rows, display message
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #aaaaaa;"><p>No products currently exist. Add some using the Submit link in the navigation.</p></div>`,
					layout: false,
				});
			} else {
				// Render alphabetically sorted results in to list in homepage
				res.render("index", {
					msg: "",
					layout: false,
					data: results,
				});
				return;
			}
		}
	);
});

// Get about route
responsive.get("/about", function (req, res) {
	res.render("about", { layout: false });
});

// Get contact route
responsive.get("/contact", function (req, res) {
	res.render("contact", { layout: false });
});

// Get submit route
responsive.get("/submit", function (req, res) {
	res.render("submit", { layout: false });
});

// ANY ROUTE THAT IS NOT EXPLICITLY SET WILL HIT THIS VIEW
responsive.get("/*", (req, res) => {
	res.render("404", { layout: false });
});

// Handles the POST request sent to "/add_product" route
// Responsible for product submission to database
responsive.post("/add_product", (req, res) => {
	let product_name = req.body.name;
	let product_link = req.body.url;
	let product_desc = req.body.description;
	let product_logo = req.body.img_url;

	let insert_query =
		"INSERT INTO Products (ProductName, ProductURL, ProductDesc, ProductImage) VALUES (?, ?, ?, ?)";
	connection.query(
		insert_query,
		[product_name, product_link, product_desc, product_logo],
		(err, results, fields) => {
			if (err) {
				// If submission is unsuccessful
				console.log(err);
				res.render("submit", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>Unable to add product.</p></div>`,
					layout: false,
				});
				return;
			} else {
				// If submission is successful
				res.render("submit", {
					msg: `<div class="status-msg" style="background-color: #2ecc71;"><p>Product successfully added.</p></div>`,
					layout: false,
				});
				return;
			}
		}
	);
});

// Start the server on Unix environment variable PORT or 8080
const PORT = process.env.PORT || 8080;

responsive.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log("Press Ctrl+C to quit.");
	console.log("");
});

// module.exports = responsive;
