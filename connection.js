const mysql = require("mysql"); // NodeJS database management

let config = {}; // define empty configuration object

if (
	process.env.MYSQL_INSTANCE_CONNECTION_NAME &&
	process.env.NODE_ENV === "production"
) {
	// database connection for production
	config = {
		user: process.env.MYSQL_USERNAME,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE_NAME,
	};
	config.socketPath = `/cloudsql/${process.env.MYSQL_INSTANCE_CONNECTION_NAME}`;
} else {
	// database connection for development
	config = {
		host: process.env.MYSQL_INSTANCE_PUBLIC_IP,
		user: process.env.MYSQL_USERNAME,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE_NAME,
	};
}

let connection = mysql.createConnection(config); // create connection object

connection.connect(function (err) {
	// actually attempt to make the connection
	if (err) {
		console.error("Error connecting: " + err.stack);
		return;
	}
	console.log(
		`Connected to ${process.env.MYSQL_DATABASE_NAME} database with thread ID: ` +
			connection.threadId
	);
});

module.exports = connection; // export the connection object to use in another JS file
