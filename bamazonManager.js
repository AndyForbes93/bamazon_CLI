var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');
//connection parameters
var connection = mysql.createConnection({
    host: "localhost",
    port: 8888,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("******************************")
    console.log("Welcome to Bamazon Marcketplace Manager's App!\n");
    //displayItems();
    startUp();
});

function startUp() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Select the option you wish to perform below: \n",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }]).then(answers => {
        //console.log(answers.action);
        switch (answers.action) {
            case "View Products for Sale":
                displayItems();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProducts();
                break;
        }
    })
}

function displayItems() {
    var query = connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            var id = [];
            var name = [];
            var department = [];
            var price = [];
            var stock = [];
            var table = new Table({
                head: ["ID", "Product Name", "Department", "Price", "Stock"],
                colWidths: [5, 30, 30, 10, 15]
            });
            for (let i = 0; i < res.length; i++) {
                id.push(res[i].item_id);
                name.push(res[i].product_name);
                department.push(res[i].department_name);
                price.push(res[i].price);
                stock.push(res[i].stock_quantity);
                table.push(
                    [id[i], name[i], department[i], price[i], stock[i]]
                );
            }
            console.log(table.toString());
            startUp();
        }
    )
}

function addProducts() {
    console.log("Add a New Product\n")
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'Enter the Department that the new product belongs to'
    }, {
        type: 'input',
        name: 'itemName',
        message: 'Enter the name of the product'

    }, {
        type: 'input',
        name: 'price',
        message: 'Enter the price of the new product'
    }, {
        type: 'input',
        name: 'quantity',
        message: 'Enter the quantity of the new product'
    }]).then(answers => {
        console.log("Added " + answers.itemName + " to " + answers.department)
        var query = connection.query(
            "INSERT INTO products SET ?", {
                product_name: answers.itemName,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quantity
            },
            function (err, res) {
                // console.log(res)
                startUp();
            }
        )
    });

}

function findCurrentInventory(currentId) {
    //console.log("running currentInventory" + currentId)
    var query = connection.query(
        "SELECT * FROM products WHERE ?", {
            item_id: currentId
        },
        function (err, res) {
            if (err) throw err;
            // console.log(res[0].stock_quantity)
            var currentStock = res[0].stock_quantity;
            //s console.log(currentStock);
            return currentStock;
            // console.log(currentStock);
        }
    )
}

function lowInventory() {
    var query = connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            var id = [];
            var name = [];
            var department = [];
            var price = [];
            var stock = [];
            var table = new Table({
                head: ["ID", "Product Name", "Department", "Price", "Stock"],
                colWidths: [5, 30, 30, 10, 15]
            });
            for (let i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 6) {
                    // console.log(res[i].product_name);
                    id.push(res[i].item_id);
                    name.push(res[i].product_name);
                    department.push(res[i].department_name);
                    price.push(res[i].price);
                    stock.push(res[i].stock_quantity);
                }
            }
            for (let j = 0; j < name.length; j++) {
                table.push(
                    [id[j], name[j], department[j], price[j], stock[j]]
                );
            }
            console.log(table.toString());
            startUp();
        }
    )
}

function addInventory() {
    console.log("Add Items to Inventory\n")
    inquirer.prompt([{
        type: 'input',
        name: 'itemId',
        message: 'Select the items ID that you want to add inventory to'
    }, {
        type: 'input',
        name: 'quantity_inventory',
        message: 'How many do you want to add?'

    }]).then(answers => {
        var idFind = answers.itemId;
        var quantityFind = answers.quantity_inventory;
        var currentStock = findCurrentInventory(idFind);
        console.log("Added " + quantityFind);
        //console.log(answers.searchTerm);
        var query = connection.query(
            "UPDATE products SET ? WHERE ?", [{
                stock_quantity: quantityFind

            }, {
                item_id: idFind
            }],
            function (err, res) {
                // console.log(res)
                startUp();
            }
        )
    });
}