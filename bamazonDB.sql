DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(60) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INTEGER(10.2)NOT NULL,
  stock_quantity INTEGER(30),
  PRIMARY KEY (id)
);

INSERT INTO products (product_name , department_name , price , stock_quantity )
VALUES ("Bauer Vapor 1X" , "Sporting Goods" , 159.99 , 1000);

