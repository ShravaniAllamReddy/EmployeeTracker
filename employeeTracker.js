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
    console.log(

        " _____                 _ \n" +
        "| ____|_ __ ___  _ __ | | ___  _   _  ___  ___   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ \n" +
        "|  _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ | '_ ` _ \\ / _` | '_ \\ / _` |/ _` |/ _ \\ '__|\n" +
        "| |___| | | | | | |_) | | (_) | |_| |  __/  __/ | | | | | | (_| | | | | (_| | (_| |  __/ |   \n" +
        "|_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___| |_| |_| |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   \n" +
        "                |_|            |___/                                         |___/           \n"

    )
    main();
});

// list of prompts to user
function main() {

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View all Employees", "View employee roles", "View all departments", "View all employees by department", "View all employees by Manager",
                "Add Employee", "Add Role", "Add departments", "Remove Role", "Remove department", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Total budget by department", "quit"]
        }
    ]).then((answers) => {
        switch (answers.choice) {
            case "View all Employees": getEmployees();
                break;

            case "View employee roles": getEmployeeRoles();
                break;

            case "View all departments": getEmployeeDepartments();
                break;

            case "View all employees by department": getEmployeesByDept();
                break;

            case "View all employees by Manager": getEmployeesByManager();
                break;

            case "Add Employee": addEmployee();
                break;

            case "Add Role": addRole();
                break;

            case "Add departments": addDepartments();
                break;

            case "Remove Employee": removeEmployee();
                break;

            case "Remove Role": removeRole();
                break;

            case "Remove department": removeDepartment();
                break;

            case "Update Employee Role": updateEmployeeRole();
                break;

            case "Update Employee Manager": updateEmployeeManager();
                break;

            case "Total budget by department": budgetByDept();
                break;

            case "quit":
                connection.end();
                break;

        }
    })
}

// to get all the employee details
function getEmployees() {
    var query = `SELECT  e.id, e.first_name, e.last_name, r.title Role, d.name AS department , r.salary,
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

// to get the employee roles
function getEmployeeRoles() {
    var query = "SELECT DISTINCT title Role FROM  role;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });
}

// to get the employee departments
function getEmployeeDepartments() {
    var query = "SELECT distinct name AS department FROM department;"

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        main();

    });
}

// to get all the employees from selected department
function getEmployeesByDept() {
    connection.query("SELECT * FROM department;", function (err, dept) {
        if (err) throw err;
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

            var query = `SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary, concat( m.first_name," ",m.last_name ) Manager
            FROM 
            employee e
            left join role r
            on  e.role_id = r.id
            left join department d 
            on r.department_id = d.id
            left join employee m on e.manager_id = m.id
            where d.id = ?;`

            connection.query(query, [answers.deptid], function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                main();

            });
        })
    })
}

// to get all the employees under chosen manager
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

            var query = `SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary, concat( m.first_name," ",m.last_name ) Manager
            FROM 
            employee e
            left join role r
            on  e.role_id = r.id
            left join department d 
            on r.department_id = d.id
            left join employee m on e.manager_id = m.id
            where e.manager_id = ?;`

            connection.query(query, [answers.managerid], function (err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.table(res);
                main();

            });
        })
    })
}

//to add the employee with all the details
function addEmployee() {

    connection.query("select * from role", function (err, roles) {

        connection.query("SELECT * from employee", function (err, emp) {
            const employees = emp.map(emp => {
                return {
                    name: emp.first_name + " " + emp.last_name,
                    value: emp.id
                }
            })
            employees.push("None");
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
                    choices: employees

                },

            ]).then((answers) => {
                console.log("Inserting a new Employee...\n");
                let managerid = "null";
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: answers.role,
                        manager_id: answers.managerid === "None" ? null : answers.managerid
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " Employee inserted!\n");
                        main();

                    }
                );
            })
        })
    })
}

// to add role into role table
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

//to add department into department table
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

// to update employee role 
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

// to update emplpoyee manager
function updateEmployeeManager() {
    connection.query("SELECT * FROM employee", function (err, res) {
        const employees = res.map(emp => {
            return {
                name: emp.first_name + " " + emp.last_name,
                value: emp.id
            }
        })
        employees.push("None");
        inquirer.prompt([
            {
                type: "list",
                name: "empid",
                message: "Which employee's manager do you want to update?",
                choices: res.map(emp => {
                    return {
                        name: emp.first_name + " " + emp.last_name,
                        value: emp.id
                    }
                })

            },
            {
                type: "list",
                name: "managerid",
                message: "which employee do you want to set as manager for the selected employee?",
                choices: employees

            }
        ]).then(answers => {

            connection.query(
                "UPDATE employee e SET e.manager_id = ? WHERE e.id = ? ",
                [answers.managerid === "None" ? null : answers.managerid, answers.empid],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    main();
                }
            );
        })
    })
}

// to delete a employee 
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
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    main();
                }
            );
        })
    })
}

//to delete a role
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

//to delete a department
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

// to find the total budget for chosen department
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

