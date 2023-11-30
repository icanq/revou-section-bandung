const mysql = require("mysql2/promise");

const connectionPool = mysql.createPool({
	uri:
		process.env.DB_URI || `msql://root:password@localhost:3306/revou_bandung`,
});

module.exports = { connectionPool };
