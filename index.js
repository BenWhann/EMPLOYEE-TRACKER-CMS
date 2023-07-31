const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME
    }
  );

   db.connect(function (err) {
    if(err) console.log(err)
   })

// function sourceSchemaSeeds() {
//     db.query("SOURCE schema.sql");
//     db.query("SOURCE seeds.sql")
// };

function start() {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'actions',
            message: 'Welcome to the ETCMS. What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee'],
        }
    ])
    .then((response) => {
        console.log(response);
        if (response.actions == 'View all departments') {

            viewAllDepartments();

        } else if (response.actions == 'View all roles') {

            viewAllRoles();

        } else if (response.actions == 'View all employees') {

            viewAllEmployees();

        } else if (response.actions == 'Add a department') {

            addDepartment();

        } else if (response.actions == 'Add a role') {

            addRole();

        } else if (response.actions == 'Add an employee') {

            addEmployee();

        } else if (response.actions == 'Update an employee') {

            updateEmployee();

        }
    })
};



async function viewAllDepartments() {
    const [departments] = await db.promise().query("SELECT * FROM department")
    console.table(departments)
    start();
};

async function viewAllRoles() {
    try{
    const [roles] = await db.promise().query("SELECT * FROM roles")
    console.table(roles)
    start();
    } catch (err) {
        console.log(err);
    }
};

async function viewAllEmployees() {
    try{
    const [employees] = await db.promise().query("SELECT * FROM employee")
    console.table(employees)
    start();
    } catch (err) {
        console.log(err);
    }
};


async function addDepartment() {

    inquirer
    .prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Which department would you like to add?',
        }
    ])
    .then(async(response) => {   
    try{
    await db.promise().query(`INSERT INTO department (department_name) VALUES('${response.department}')`)
    viewAllDepartments();
    } catch (err) {
        console.log(err);
    }  
    })


};

async function addRole() {
    const [departments] = await db.promise().query("SELECT * FROM department")
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the title of this role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'What is the name of the department for this role?',
            choices: departments.map(({id, department_name}) => ({
                name: department_name, 
                value: id
            }))
        },
    ])
    .then(async(response) => {   
        console.log([response.role, response.salary, response.department_id]);
        try{
        await db.promise().query(`INSERT INTO roles (title, salary, department_id) VALUES('${response.role}', '${response.salary}', '${response.department_id}')`)
        viewAllRoles();
        } catch (err) {
            console.log(err);
        }  
    })


};

async function addEmployee() {
    const [roles] = await db.promise().query("SELECT * FROM roles")
    const [employees] = await db.promise().query("SELECT * FROM employee")
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'first',
            message: "What is this employee's first name?",
        },
        {
            type: 'input',
            name: 'last',
            message: "What is this employee's last name?",
        },
        {
            type: 'list',
            name: 'role_id',
            message: "What is the name of this employee's role?",
            choices: roles.map(({id, title}) => ({
                name: title, 
                value: id
            }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Who is this employee's manager?",
            choices: employees.map(({first_name, last_name, id}) => ({
                name: `${first_name} ${last_name}`, 
                value: id
            }))
        },
    ])
    .then(async(response) => {   
        console.log(response);
    try{
    await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('${response.first}', '${response.last}', '${response.role_id}', '${response.manager_id}')`)
    viewAllEmployees();
    } catch (err) {
        console.log(err);
    }  
    })
};

async function updateEmployee() {
    const [roles] = await db.promise().query("SELECT * FROM roles")
    const [employees] = await db.promise().query("SELECT * FROM employee")
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'employee_name',
            message: 'Please choose the employee to be updated.',
            choices: employees.map(({id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`, 
                value: id
            }))
        },
        {
            type: 'list',
            name: 'roleUpdate',
            message: "Please choose this employee's new role.",
            choices: roles.map(({id, title}) => ({
                name: title, 
                value: id
            }))
        },
    ])
    .then(async(response) => {   
        console.log(response);
    try{
    await db.promise().query(`UPDATE employee SET role_id=${response.roleUpdate} WHERE id=${response.employee_name}`)
    viewAllEmployees();
    } catch (err) {
        console.log(err);
    }  
    })
};

// sourceSchemaSeeds();
start();
