const mysql = require('mysql');
const inquirer = require('inquirer');
require("console.table");

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
            choices: ["View all Employees", "View employee roles", "View all departments", "View all employees by department", "View all employees by Manager",
                "Add Employee", "Add Role", "Add departments", "Remove Role", "Remove department", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Total budget by department"]
        }
    ]).then((answers) => {

        if (answers.choice === "View all Employees") {
            getEmployees();
        }
        else if (answers.choice === "View employee roles") {
            getEmployeeRoles();
        }
        else if (answers.choice === "View all departments") {
            getEmployeeDepartments();
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
        else if (answers.choice === "Remove Role") {
            removeRole();
        }
        else if (answers.choice === "Remove department") {
            removeDepartment();
        }
        else if (answers.choice === "Update Employee Role") {
            updateEmployeeRole();
        }
        else if (answers.choice === "Update Employee Manager") {
            updateEmployeeManager();
        }
        else if (answers.choice === "Total budget by department") {
            budgetByDept();

        }
        else {
            connection.end();
        }
    })

}

function getEmployees() {
    var query = `SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary,
    concat( manager.first_name," ",manager.last_name ) Manager
    FROM 
    employee e
    left join role r
    on  e.role_id = r.id
    left join department d 
    on r.department_id = d.id
    left join employee manager on e.manager_id = manager.id;`

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });

}

function getEmployeeRoles() {
    var query = `select concat(e.first_name," ",e.last_name) Employee_Name, r.title
    from 
    employee e 
    join role r 
    on e.role_id = r.id;`
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });
}

function getEmployeeDepartments() {
    var query = `SELECT  concat(e.first_name," ",e.last_name) Employee_Name, d.name AS department
    FROM 
    employee AS e
    join role AS r
    on  e.role_id = r.id
    join department as d 
    on r.department_id = d.id;`

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });
}


function getEmployeesByDept() {
    connection.query("SELECT * FROM department;", function (err, dept) {
        inquirer.prompt([
            {
                type: "list",
                name: "deptid",
                message: "Choose one department",
                choices: dept.map(dept => {
                    return {
                        name: dept.name,
                        value: dept.id
                    }
                })
            }

        ]).then((answers) => {

            var query = "SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department,r.salary, e.manager_id ";
            query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";
            query += "where d.id = ? ";

            connection.query(query, [answers.deptid], function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                main();

            });
        })
    })
}


function getEmployeesByManager() {
    connection.query(`SELECT  distinct concat(m.first_name," ",m.last_name) Manager, m.id
    FROM employee e, employee m WHERE e.manager_id = m.id;`, function (err, emp) {
        inquirer.prompt([
            {
                type: "list",
                name: "managerid",
                message: "Which Manager employees you would like to view?",
                choices: emp.map(emp => {

                    return {
                        name: emp.Manager,
                        value: emp.id
                    }
                })
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
    })
}

function addEmployee() {

    connection.query("select * from role", function (err, roles) {

        connection.query(`SELECT  distinct concat(m.first_name," ",m.last_name) Manager, m.id
        FROM employee e, employee m WHERE e.manager_id = m.id;`, function (err, emp) {

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
                    type: "list",
                    name: "role",
                    message: "What is the employee's role",
                    choices: roles.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                },
                {
                    type: "list",
                    name: "managerid",
                    message: "who is the employee's manager",
                    choices: emp.map(emp => {
                        return {
                            name: emp.Manager,
                            value: emp.manager_id
                        }
                    })
                },

            ]).then((answers) => {
                console.log("Inserting a new Employee...\n");

                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: answers.role,
                        manager_id: answers.managerid
                        // manager_id: answers.managerid.toLowerCase() === "null" ? null : answers.managerid                   
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " Employee inserted!\n");
                        main();

                        // updateProduct();
                    }
                );
            })
        })
    })
}

function addRole() {
    connection.query("select * from department", function (err, dept) {

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
                type: "list",
                name: "departmentid",
                message: "Enter the employee's department",
                choices: dept.map(dept => {
                    return {
                        name: dept.name,
                        value: dept.id
                    }
                })
            },

        ]).then((answers) => {
            console.log("Inserting a new Role...\n");
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.departmentid
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " Role inserted!\n");
                    main();

                }
            );
        })
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

        connection.query(`SELECT  distinct concat(m.first_name," ",m.last_name) Manager, m.id
        FROM employee e, employee m WHERE e.manager_id = m.id;`, function (err, emp) {
            inquirer.prompt([
                {
                    type: "list",
                    name: "empid",
                    message: "Which Employee's Manager you would like to update?",
                    choices: res.map(emp => {
                        return {
                            name: emp.first_name + " " + emp.last_name,
                            value: emp.id
                        }
                    })

                },
                {
                    type: "input",
                    name: "manager_id",
                    message: "Choose one Manager",
                    choices: emp.map(emp => {
                        return {
                            name: emp.Manager,
                            value: emp.id
                        }
                    })
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
                        name: emp.first_name + " " + emp.last_name,
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

function removeRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "roleid",
                message: "Which role you would like to delete?",
                choices: res.map(role => {
                    return {
                        title: role.title,
                        value: role.id
                    }
                })
            }
        ]).then(answers => {

            connection.query(
                "DELETE FROM role WHERE ?",
                {
                    id: answers.roleid
                },
                function (err) {
                    if (err) throw err;

                    main();
                }
            );
        })
    })
}


function removeDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "deptid",
                message: "Which department you would like to delete?",
                choices: res.map(dept => {
                    return {
                        name: dept.name,
                        value: dept.id
                    }
                })

            }
        ]).then(answers => {

            connection.query(
                "DELETE FROM department WHERE ?",
                {
                    id: answers.deptid
                },
                function (err) {
                    if (err) throw err;

                    main();
                }
            );
        })
    })

}

function budgetByDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "deptid",
                message: "which department budget you would like calculate? ",
                choices: res.map(dept => {
                    return {
                        name: dept.name,
                        value: id
                    }
                })
            }

        ]).then((answers) => {

            var query = "SELECT d.name AS department,SUM(r.salary) as budgetbydept ";
            query += "FROM employee AS e INNER JOIN role AS r on  e.role_id = r.id INNER JOIN department as d on r.department_id = d.id ";
            query += "where d.id = ? ";

            connection.query(query, [answers.deptid], function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                main();

            });
        })

    })
}

