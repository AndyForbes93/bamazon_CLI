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
    // console.log("connected as id " + connection.threadId);
    console.log("********************************")
    console.log("Welcome to Bamazon Marcketplace!\n");
    displayItems();
    //startUp();
});

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

function startUp() {
    var startUpQuestions = [{
        type: 'input',
        name: 'item_id',
        message: "Please enter the product id you wish to purchase\n"
    }, {
        type: 'input',
        name: 'quantity',
        message: "How many do you wish to purchase?\n"
    }];
    //this will update the greatbayDB with the information that the user posts
    inquirer.prompt(startUpQuestions).then(answers => {
        //  item_id_picked = parseInt(answers.item_id);
        //  return item_id_picked;
        //  item_quantity_picked = parseInt(answers.quantity);
        // return item_quantity_picked;
        //  console.log(JSON.stringify(answers, null, '  '));
        //  console.log(answers.item_id , answers.quantity);
        checkQuantity(answers.item_id, answers.quantity);
    })
}

function checkQuantity(id, quantity) {
    //  console.log(id, quantity);
    var query = connection.query(
        "SELECT * FROM products WHERE ?", {
            item_id: id
        },
        function (err, res) {
            if (err) throw err;
            //  console.log(res);
            if (quantity > res[0].stock_quantity) {
                console.log("Sorry Bamazon doesn't have enough in stock to fill that order, try again.\n");
                startUp();
            } else if (quantity <= res[0].stock_quantity) {
                var updatedQuantity = res[0].stock_quantity;
                updatedQuantity -= quantity;
                // console.log(updatedQuantity);
                console.log("Congrats! You just bought " + quantity + " " + res[0].product_name + "'s\n");
                updateQuantity(id, updatedQuantity);
            }
        }
    )
}

function updateQuantity(id, updatedQuantity) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: updatedQuantity
        }, {
            item_id: id
        }],
        function (err, res) {
            if (err) throw err;

            // console.log(res);
            console.log("Welcome Back to Bamazon Marketplace!\n");
            displayItems();
            // startUp();,

        }

    )
}