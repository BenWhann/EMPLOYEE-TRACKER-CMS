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
    const [roles] = await db.promise().query("SELECT * FROM roles")
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
            choices: roles.map(({id, department_name}) => ({
                name: department_name, 
                value: id
            }))
        },
    ])
    .then(async(response) => {   
        console.log([response.role, response.salary, response.department_id]);
        start();
    // try{
    // await db.promise().query(`INSERT INTO roles (role_name) VALUES('${[response.department_id]}')`)
    // viewAllRoles();
    // } catch (err) {
    //     console.log(err);
    // }  
    })


};

// async function addEmployee() {
//     const [roles] = await db.promise().query("SELECT * FROM roles")
//     inquirer
//     .prompt([
//         {
//             type: 'input',
//             name: 'first-name',
//             message: "What is this employee's first name?",
//         },
//         {
//             type: 'input',
//             name: 'last-name',
//             message: "What is this employee's last name?",
//         },
//         {
//             type: 'list',
//             name: 'role_id',
//             message: "What is the name of this employee's role?",
//             choices: roles.map(({id, role_name}) => ({
//                 name: role_name, 
//                 value: id
//             }))
//         },
//         {
//             type: 'list',
//             name: 'manager_id',
//             message: "What is the name of this employee's manager?",
//             choices: departments.map(({id, manager_name}) => ({
//                 name: manager_name, 
//                 value: id
//             }))
//         },
//     ])
//     .then(async(response) => {   
//         console.log(response);
//     try{
//     await db.promise().query(`INSERT INTO department (department_name) VALUES('${response.department}')`)
//     viewAllDepartments();
//     } catch (err) {
//         console.log(err);
//     }  
//     })
// };

start();
