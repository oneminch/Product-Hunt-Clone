"use strict";

const express = require("express"); // for webpage managment with NodeJS
const bodyParser = require("body-parser"); // for parsing HTTP requests and responses
const exphbs = require("express-handlebars"); // web template middleware engine
const path = require("path"); // core JS module for handling file paths
const { Pool } = require("pg"); // node-postgres library
const dotenv = require("dotenv"); // set up config for ".env" file
dotenv.config();

const app = express(); // creating a new webpage management instance

// set default filepath for public resources (images, stylesheets, etc...)
app.use("/public", express.static(path.join(__dirname, "public")));

// Declare view engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This will print HTTP request methods live as they happen
app.use(function (req, res, next) {
	console.log(`Request -> (Method: ${req.method}, URL: ${req.url})`);
	next();
});

// Create a connection pool using the connection information provided on bit.io.
const pool = new Pool({
    user: process.env.USERNAME,
    host: 'db.bit.io',
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
});

pool.connect();

// Get root (index) route and display products
app.get("/", function (req, res) {
	pool.query(
		"SELECT * FROM Products", // get all of the "Products" table data
		(err, results) => {
			if (err) {
				// if error occurred while trying to acquire product data
				console.log(err);
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>There was an error. Please reload to try again.</p></div>`,
					layout: false,
				});
				return;
			} else if (results.rows.length <= 0) {
				// if there are no data rows available in the "Products" table
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #aaaaaa;"><p>No products found in the database. <br/> Start adding some using the Submit link in the navigation.</p></div>`,
					layout: false,
				});
			} else {
				// acquired "Products" table data and rendered in the homepage
				res.render("index", {
					msg: "",
					layout: false,
					data: results.rows,
				});
				return;
			}
		}
	);
});

// Handles SEARCHING of products
app.post("/search_products", function (req, res) {
	pool.query(
		`SELECT * FROM products WHERE productname ILIKE '%${req.body.search_query}%'`,
		(err, results) => {
			if (err) {
				// if error occurred while trying to acquire data
				console.log(err);
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>There was an error. Please reload and try again.</p></div>`,
					layout: false,
				});
				return;
			} else if (results.rows.length <= 0) {
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
					data: results.rows,
				});
				return;
			}
		}
	);
});

// handles SORTING of products
app.post("/sort_products", function (req, res) {
	pool.query(
		`SELECT * FROM Products ORDER BY ProductName ASC`,
		(err, results) => {
			if (err) {
				// if error occurred while trying to acquire data
				console.log(err);
				res.render("index", {
					msg: `<div class="status-msg" style="background-color: #eb4d4b;"><p>There was an error. Please reload and try again.</p></div>`,
					layout: false,
				});
				return;
			} else if (results.rows.length <= 0) {
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
					data: results.rows,
				});
				return;
			}
		}
	);
});

// Get about route
app.get("/about", function (req, res) {
	res.render("about", { layout: false });
});

// Get contact route
app.get("/contact", function (req, res) {
	res.render("contact", { layout: false });
});

// Get submit route
app.get("/submit", function (req, res) {
	res.render("submit", { layout: false });
});

// ANY ROUTE THAT IS NOT EXPLICITLY SET WILL HIT THIS VIEW
app.get("/*", (req, res) => {
	res.render("404", { layout: false });
});

// Handles the POST request sent to "/add_product" route
// Responsible for product submission to database
app.post("/add_product", (req, res) => {
	let product_name = req.body.name;
	let product_link = req.body.url;
	let product_desc = req.body.description;
	let product_logo = req.body.img_url;

	let insert_query =
		"INSERT INTO Products (ProductName, ProductURL, ProductDesc, ProductImage) VALUES ($1, $2, $3, $4)";
	pool.query(
		insert_query,
		[product_name, product_link, product_desc, product_logo],
		(err, results) => {
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

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log("Press Ctrl+C to quit.");
	console.log("");
});

module.exports = app;
