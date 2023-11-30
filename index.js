// import dotenv agar process.env bisa dibaca oleh aplikasi
require("dotenv").config();

//  import package express, bukan http ya
const express = require("express");
// pake expressnya dengan cara ditampung disebuah variabel
const server = express();

// import mysql connection dari config/database.js
const { connectionPool } = require("./config/database");

// pura pura ambil data dari database padahal dari folder data
const fs = require("fs");

// import cors
const cors = require("cors");

// define port
const PORT = 3000;

// pakai cors biar bisa share resource antar backend dan frontend
server.use(cors());

// middleware dari express agar aplikasi express bisa membaca data dari request body
// untuk memakai middleware di express kalian pakai kode
// server.use(<middlewarenya>)
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const loggerMiddleware = (req, res, next) => {
	// '[date] - request method - route - status'
	const now = new Date();
	const formattedTime = now.toLocaleDateString();
	const method = req.method;
	const url = req.url;
	const status = res.statusCode;
	console.log(`[${formattedTime}] ${method} ${url} - ${status}`);
	next();
};

// const authenticationMiddleware = (req, res, next) => {
// 	// ambil token dari req.headers
// 	// const { token } = req.headers;
// 	// bandingin token yang ada dari headers atau dari request, dengan token yang ada di database
// 	// kalau tokennya beda -> not authenticated | bodong -> res.status(401).send("youre not authenticated")
// 	// kalau tokennya sama -> next()
// };

// untuk memakai middleware yang diterapkan seluruh aplikasi
server.use(loggerMiddleware);

// untuk pakai middleware yang diterapkan hanya untuk rute tertentu saja kalian bisa langsung selipkan middleware tersebut pada rute kalian, contoh
// server.get("/iniygdipakeinmiddleware", loggerMiddleware, (req,res) => {})

// handle request di main routes ("/")
server.get("/", function (request, response) {
	// aku gamau baca detail requestnya aku mau langsung
	// kirim response aja
	response.send("Aku balikin sebuah RESPONz");
});

// dari rute ini harapannya bisa mengirimkan data produk ke yang request data product
server.get("/products", async (req, res) => {
	// nanti proses logicnya itu ngambil data dulu dari database, lalu dikirim melaluli response, saat ini kita bakal pake data dari json dulu/fake data

	// ambil data json dari /data/products.json
	// fs.readFile("./data/products.json", (error, data) => {
	// 	if (error) res.send("Gagal dalam pembacaan data");
	// 	const products = JSON.parse(data);
	// 	res.status(200).send(products);
	// });

	// sekarang kita bisa ambil data langsung dari db dengan menggunakan connection pool yang dibikin di config tadi
	const connection = await connectionPool.getConnection();
	try {
		const [products] = await connection.query(`SELECT * FROM Product`);
		console.log(products);
		res.status(200).send(products);
	} catch (error) {
		console.log(error);
	}
});

// request params
// untuk mengambil data berdasarkan id, alangkah baiknya untuk mencari idnya itu ditaro idnya lewat params, gimana caranya
server.get("/products/:id", async (request, response) => {
	const { id } = request.params;

	// filter data berdasarkan id yang masuk lewat query params
	// karena data masih belum dari database, kita pake logic js sederhana aja
	// fs.readFile("./data/products.json", (error, data) => {
	// 	if (error) response.send("Gagal dalam pembacaan data");
	// 	const products = JSON.parse(data);
	// 	const product = products.find((product) => product.id === parseInt(id));
	// 	if (!product) {
	// 		response.status(404).send("Product not found");
	// 	}
	// 	response.status(200).send(product);
	// });

	// ambil data product based on id yang masuk lewat request params
	const connection = await connectionPool.getConnection();
	try {
		const [products] = await connection.query(
			`SELECT * FROM Product WHERE id = ?`,
			[id]
		);
		console.log(products);
		if (!products.length) {
			response.status(404).send("Product not found");
		} else {
			response.status(200).send(products);
		}
	} catch (error) {
		console.log(error);
	}
});

server.post("/products", async (req, res) => {
	console.log(req.body);
	// deconstruct object dari request body
	const { name, price, imageUrl, catalog_id } = req.body;

	// kalau kalian pake SQL kan nanti eksekusinya pake query
	// INSERT INTO <namatabelnya> VALUES ($1, $2, $3) [NAME, PRICE, CATALOG]
	// kalau skrg kita masukinnya ke json dulu aja
	// fs.readFile("./data/products.json", (err, data) => {
	// 	if (err) res.send("Gagal dalam membaca json");
	// 	const products = JSON.parse(data);
	// 	const newProduct = {
	// 		id: products.length + 1,
	// 		name: name,
	// 		price: price,
	// 		catalog: catalog,
	// 	};
	// 	// 1, 2, 3, Push (4)
	// 	products.push(newProduct);

	// 	fs.writeFile(
	// 		"./data/products.json",
	// 		JSON.stringify(products, "", 2),
	// 		(err) => {
	// 			if (err) res.status(400).send("Gagal dalam memasukan data");
	// 			res.status(201).send({
	// 				message: "sukses dalam menambahkan data",
	// 				data: newProduct,
	// 			});
	// 		}
	// 	);
	// });

	// insert data to database
	const connection = await connectionPool.getConnection();
	const date_now = new Date().toISOString().slice(0, 19).replace("T", " ");
	try {
		const createdProduct = await connection.query(
			`INSERT INTO Product (name, price, imageUrl, catalog_id, created_at) VALUES (?, ?, ?, ?, ?)`,
			[name, price, imageUrl, catalog_id, date_now]
		);
		console.log(createdProduct);
		res.status(201).send(createdProduct);
	} catch (error) {
		console.log(error);
	}
});

// tangkap semua request/permintaan ke rute yang tidak dikenal
server.all("*", (req, res) => {
	res.status(404).send("404 routes not found");
});

// yg gini namanya pake arrow function
// server.get("/", (request, response) => {});
server.listen(PORT, () => {
	console.log(
		`iya servernya udah nyala nih, cek aja di url: http://localhost:${PORT}`
	);
});
