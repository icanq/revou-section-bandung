//  import package express, bukan http ya
const express = require("express");
// pake expressnya dengan cara ditampung disebuah variabel
const server = express();

// pura pura ambil data dari database padahal dari folder data
const fs = require("fs");

// import cors
const cors = require("cors");

// define port
const PORT = 3000;

// pakai cors biar bisa share resource antar backend dan frontend
server.use(cors());

// handle request di main routes ("/")
server.get("/", function (request, response) {
	// aku gamau baca detail requestnya aku mau langsung
	// kirim response aja
	response.send("Aku balikin sebuah RESPONz");
});

// dari rute ini harapannya bisa mengirimkan data produk ke yang request data product
server.get("/products", (req, res) => {
	// nanti proses logicnya itu ngambil data dulu dari database, lalu dikirim melaluli response, saat ini kita bakal pake data dari json dulu/fake data

	// ambil data json dari /data/products.json
	fs.readFile("./data/products.json", (error, data) => {
		if (error) res.send("Gagal dalam pembacaan data");
		const products = JSON.parse(data);
		res.status(200).send(products);
	});
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
