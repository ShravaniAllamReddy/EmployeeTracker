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
    inquirer.prompt([
        {
            type: "input",
            name: "dname",
            message: "Enter the department name of the employees you would like to view",
        }

    ]).then((answers) => {

        var query = "SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department,r.salary, e.manager_id ";
        query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";
        query += "where d.name = ? ";

        connection.query(query, [answers.dname], function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);
            main();

        });
    })
}


function getEmployeesByManager() {
    inquirer.prompt([
        {
            type: "input",
            name: "managerid",
            message: "Enter the managerid under which you want to view the employees",
        }

    ]).then((answers) => {

        var query = "SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department,r.salary, e.manager_id ";
        query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";
        query += "where e.manager_id = ? ";

        connection.query(query, [answers.managerid], function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);
            main();

        });
    })

}

function addEmployee() {

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter the first name of the employee",
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter the last name of the employee",
        },
        {
            type: "number",
            name: "role_id",
            message: "Enter the role id",
        },
        {
            type: "number",
            name: "manager_id",
            message: "Enter the manager id",
        },

    ]).then((answers) => {
        console.log("Inserting a new Employee...\n");
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role_id,
                manager_id: answers.manager_id
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " Employee inserted!\n");
                main();

                // updateProduct();
            }
        );
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the role title",
        },
        {
            type: "number",
            name: "salary",
            message: "Enter the salary of the employee",
        },
        {
            type: "number",
            name: "department_id",
            message: "Enter the department id",
        },

    ]).then((answers) => {
        console.log("Inserting a new Role...\n");
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answers.title,
                salary: answers.salary,
                department_id: answers.department_id
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " Role inserted!\n");
                main();

            }
        );
    })
}

function addDepartments() {
    inquirer.prompt([
        {
            type: "input",
            name: "dname",
            message: "Enter the department you would like to add",
        },
    ]).then((answers) => {
        console.log("Inserting a new department...\n");
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answers.dname
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " Department inserted!\n");
                main();
            }
        );
    })
}

function updateEmployeeRole() {
    connection.query("SELECT  e.id, e.first_name, r.title FROM employee AS e join role AS r on  e.role_id = r.id;", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "empid",
                message: "Which Employee role you would like to update?",
                choices: res.map(emp => {
                    return {
                        name: emp.first_name,
                        value: emp.id
                    }
                })

            },
            {
                type: "input",
                name: "title",
                message: "Enter the new Role to be updated:"
            }
        ]).then(answers => {
            connection.query(
                "UPDATE role r join employee e ON e.role_id = r.id SET r.title = ? WHERE e.id = ? ",
                [answers.title, answers.empid],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    main();
                }
            )
        })

    })
}


function updateEmployeeManager() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "empid",
                message: "Which Employee role you would like to update?",
                choices: res.map(emp => {
                    return {
                        name: emp.first_name,
                        value: emp.id
                    }
                })

            },
            {
                type: "input",
                name: "manager_id",
                message: "Enter the new manager Id of the employee to be updated:"
            }
        ]).then(answers => {
            connection.query(
                "UPDATE employee e SET e.manager_id = ? WHERE e.id = ? ",
                [answers.manager_id, answers.empid],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    main();
                }
            )
        })

    })
}

function removeEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "empid",
                message: "Which Employee you would like to delete?",
                choices: res.map(emp => {
                    return {
                        first_name: emp.first_name,
                        last_name: emp.last_name,
                        value: emp.id
                    }
                })

            }
        ]).then(answers => {

            connection.query(
                "DELETE FROM employee WHERE ?",
                {
                    id: answers.empid
                },
                function (err) {
                    if (err) throw err;

                    main();
                }
            );
        })
    })
}
