const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Sweety123",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    main();
});


function main() {

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View all Employees", "View all employees by department", "View all employees by Manager",
                "Add Employee", "Add Role", "Add departments", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
        }
    ]).then((answers) => {

        if (answers.choice === "View all Employees") {
            getEmployees();
        }
        else if (answers.choice === "View all employees by department") {
            getEmployeesByDept();
        }
        else if (answers.choice === "View all employees by Manager") {
            getEmployeesByManager();
        }
        else if (answers.choice === "Add Employee") {
            addEmployee();
        }
        else if (answers.choice === "Add Role") {
            addRole();
        }
        else if (answers.choice === "Add departments") {
            addDepartments();
        }
        else if (answers.choice === "Remove Employee") {
            removeEmployee();
        }
        else if (answers.choice === "Update Employee Role") {
            updateEmployeeRole();
        }
        else if (answers.choice === "Update Employee Manager") {
            updateEmployeeManager();
        }
        else {
            connection.end();
        }
    })

}

function getEmployees() {
    var query = "SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department,r.salary, e.manager_id ";
    query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });

}


function getEmployeesByDept() {
    var query = "SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department,r.salary, e.manager_id ";
    query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";
    query += "where d.name = 'Engineering' ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });

}


function getEmployeesByManager() {
    var query = "SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department,r.salary, e.manager_id ";
    query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";
    query += "where e.manager_id = '23' ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });

}

function addEmployee() {
    console.log("Inserting a new Employee...\n");
    var query = connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: "sanjay",
            last_name: "bollam",
            role_id: 3,
            manager_id: 45
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Employee inserted!\n");
            main();

            // updateProduct();
        }
    );
}

function addRole() {
    console.log("Inserting a new Role...\n");
    var query = connection.query(
        "INSERT INTO role SET ?",
        {
            title: "Software Developer",
            salary: 4000,
            department_id: 3
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Role inserted!\n");
            main();

        }
    );
}

function addDepartments() {
    console.log("Inserting a new department...\n");
    var query = connection.query(
        "INSERT INTO department SET ?",
        {
            name: "Accounts"
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Department inserted!\n");
            main();
        }
    );
}

