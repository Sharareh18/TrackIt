// dependencies
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql2 = require('mysql2');
const mysql = require('mysql');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'business_db'
    });

db.connect(function (err) {
    if (err) throw err;
    console.log(`Connected to the business_db database.`)
    console.log(`
    **********************************************
    **********************************************
    *********** WELCOME TO TRACKIT ***************
    **********************************************
    **********************************************
    `)
    startQ();
});


// ask what user wants to do
function startQ() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "View department budget",
            "Quit",
        ]
    })
        .then(function (result) {
            // can I have it all in one place like the shapes or do they need to all be separated?
            switch (result.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "View department budget":
                    viewDepartmentBudget();
                    break;
                case "Quit":
                    quitProgram();
                    break;

            }
        });
};


function viewAllDepartments() {
    db.query('SELECT department.id AS "Dep ID", department.name AS "Department" FROM department',
        (err, results) => {
            if (err) throw err;
            console.table(results);
            startQ();
        });
};

function viewAllRoles() {
    db.query('SELECT role.title AS "Job Title", role.id AS "Role ID", role.salary FROM role INNER JOIN department ON role.department_id = department.id',
        (err, results) => {
            if (err) throw err;
            console.table(results);
            startQ();
        });
};


function viewAllEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
        (err, results) => {
            if (err) throw err;
            console.table(results);
            startQ();
        });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter a name for the department you want to add",
        }
    ]).then(answer => {
        db.query('INSERT INTO department SET ?', { name: answer.name }, function (err, results) {
            if (err) throw err;
            console.log("Department added.");
            db.query('SELECT * FROM department', (err, results) => {
                if (err) throw err;
                console.table(results);
                startQ();
            });
        });
    });
};

function addRole() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter a title for the role you want to add",
            },
            {
                type: "input",
                name: "salary",
                message: "Enter a salary for the new role.",
            },
            {
                type: "list",
                name: "department_id",
                message: "Select a department for the new role.",
                choices: results.map(department => ({ name: department.name, value: department.id }))
            }
        ]).then(answer => {
            db.query('INSERT INTO role SET ?', answer, function (err, results) {
                if (err) throw err;
                console.log("Role added");
                db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id',
                    (err, results) => {
                        if (err) throw err;
                        console.table(results);
                        startQ();
                    });
            });
        });
    });
};


function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter employee's first name",
            name: "first_name"
        },
        {
            type: "input",
            message: "Please enter employee's last name",
            name: "last_name"
        },
        {
            type: "input",
            message: "Please enter the employee's role id number",
            name: "role_id"
        },
        {
            type: "input",
            message: "Pleas enter the id for the employee's manager",
            name: "manager_id"
        }
    ]).then(answer => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], function (err, results) {
            if (err) throw err;
            console.log("Employee added");
            db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
                (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    startQ();
                });
        });
    });
};

function updateEmployeeRole() {
    // Prompt the user for the employee ID and new role ID
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the ID of the employee you want to update",
            name: "employee_id"
        },
        {
            type: "input",
            message: "Please enter the ID of the new role",
            name: "role_id"
        }
    ]).then(answer => {
        // Update the employee's role in the database
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id], function (err, results) {
            if (err) throw err;
            console.log("Employee role updated");
            db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
                (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    startQ();
                });
        });
    });
};

function viewDepartmentBudget() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "Enter the name of the department to view budget for:"
    }).then(answer => {
        db.query('SELECT department.name AS "Department", SUM(role.salary) AS "Utilized Budget" FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = ? GROUP BY department.name', [answer.department], function (err, results) {
            if (err) throw err;
            console.table(results);
            startQ();
        });
    });
};

function quitProgram() {
    console.log("Bye! Thanks for using TrackIt");
    process.exit(0);
  };