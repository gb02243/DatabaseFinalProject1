-- Griffin Bryant and Serggio Montero
DROP DATABASE IF EXISTS InventoryManager;
CREATE DATABASE InventoryManager;
USE InventoryManager;

CREATE TABLE Stores (
	store_id INT NOT NULL,
	PRIMARY KEY (store_id)
);

CREATE TABLE Departments(
	id INT NOT NULL,
	name VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE Products (
	id INT NOT NULL,
	brand VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	model VARCHAR(255) NOT NULL,
	supplier_id INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Suppliers (
	id INT NOT NULL,
	name varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Customers (
	id INT NOT NULL,
	fname varchar(255) NOT NULL,
	lname varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Supply_Orders (
	order_id INT NOT NULL,
	supplier_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
	order_date DATETIME NOT NULL,
	arrival_date DATE NOT NULL,
	PRIMARY KEY (order_id)
);

CREATE TABLE Customer_Orders (
	order_id INT NOT NULL,
	customer_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
	address varchar(255) NOT NULL,
	order_date DATETIME NOT NULL,
	arrival_date DATE NOT NULL,
	PRIMARY KEY (order_id)
);

CREATE TABLE Stock (
	product_id INT(255) NOT NULL,
	upc VARCHAR(255) NOT NULL,
	store_id INT NOT NULL,
	department_id INT NOT NULL,
	buy_price FLOAT NOT NULL,
	rent_price FLOAT,
	quantity_in INT NOT NULL,
	quantity_rented INT,
	quantity_ordered INT NOT NULL,
	rentable BOOLEAN,
	PRIMARY KEY (product_id)
);

CREATE TABLE Users (
  id int NOT NULL,
  name varchar(255) NOT NULL,
  username varchar(100) NOT NULL,
  password varchar(100) NOT NULL,
  type varchar(20) NOT NULL DEFAULT 'user',
  unique(username),
  PRIMARY KEY (id)
); 

ALTER TABLE Supply_Orders ADD CONSTRAINT FOREIGN KEY (supplier_id) REFERENCES Suppliers(id);
ALTER TABLE Supply_Orders ADD CONSTRAINT FOREIGN KEY (product_id) REFERENCES Products(id);

ALTER TABLE Stock ADD CONSTRAINT FOREIGN KEY (product_id) REFERENCES Products(id);
ALTER TABLE Stock ADD CONSTRAINT FOREIGN KEY (store_id) REFERENCES Stores(store_id);
ALTER TABLE Stock ADD CONSTRAINT FOREIGN KEY (department_id) REFERENCES Departments(id);

ALTER TABLE Products ADD CONSTRAINT FOREIGN KEY (supplier_id) REFERENCES Suppliers(id);

ALTER TABLE Customer_Orders ADD CONSTRAINT FOREIGN KEY (customer_id) REFERENCES Customers(id);
ALTER TABLE Customer_Orders ADD CONSTRAINT FOREIGN KEY (product_id) REFERENCES Stock(product_id);
