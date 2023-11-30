-- file ini dibuat untuk menginisiasi database yang digunakan pada aplikasi ini
-- jadi isinya hanyalah untuk membuat database
-- dan define table yang diperlukan
-- untuk saat ini table yang akan dibuat itu tabel product dan catalog

CREATE DATABASE IF NOT EXISTS `revou_bandung`;

USE `revou_bandung`;

-- CREATE TABLE PRODUCT

CREATE TABLE IF NOT EXISTS Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(1000) NOT NULL,
  price INT NOT NULL,
  imageUrl TEXT,
  catalog_id INT,
  created_at DATE
);

CREATE TABLE IF NOT EXISTS Catalog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(1000)
);

-- data seed
INSERT INTO Product (name, price, imageUrl, catalog_id, created_at) VALUES (
  'Mirasoul Flight Unit',
  132000,
  'https://static.wikia.nocookie.net/gunplabuilders/images/2/21/HGTWFM-Mirasoul-Flight-Unit-box.jpg/revision/latest/scale-to-width-down/1000?cb=20230114125524',
  1,
  '2023-11-30'
);