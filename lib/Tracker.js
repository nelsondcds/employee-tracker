const inquirer = require('inquirer');
const db = require('../db/connection');

class Tracker {

    menu() {
        inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all employees', 'add an employee', 'update an employee role', 'view all roles',
                      'add a role', 'view all departments', 'add a department', 'exit app']
        })
        .then(({ menu }) => {
            switch (menu) {
                case 'view all employees':
                    this.allEmployees();
                    break;
                case 'add an employee':
                    this.addEmployee();
                    break;
                case 'update an employee role':
                    this.updateEmployeeRole();
                    break;
                case 'view all roles':
                    this.allRoles();
                    break;
                case 'add a role':
                    this.addRole();
                    break;
                case 'view all departments':
                    this.allDepartments();
                    break;
                case 'add a department':
                    this.addDepartment();
                    break;
                case 'exit app':
                    db.end();
                    break;
            }
        });
    }

    allEmployees() {
        const sql = `SELECT A.id, CONCAT(A.first_name, ' ', A.last_name) AS name, 
                     employee_role.title AS title,
                     departments.name AS department,
                     employee_role.salary AS salary,
                     CONCAT(B.first_name, ' ', B.last_name) AS manager
                     FROM employees A
                     LEFT JOIN employee_role ON A.role_id = employee_role.id
                     LEFT JOIN departments ON employee_role.department_id = departments.id
                     LEFT JOIN employees B ON B.id = A.manager_id;`
        ;

        db.query(sql, (req, res) => {
            console.log('\n');
            console.table(res);
            console.log('\n');
            this.menu();
        });
    }

    addEmployee() {
        const sql1 = `SELECT * FROM employees;`;
        const sql2 = `SELECT * FROM employee_role;`;
        let managers = ['None'];
        let manager_ids = [];
        let roles = [];

        db.query(sql1, (req, res) => {
            for (var i = 0; i < res.length; i++) {
                managers.push(res[i].first_name + ' ' + res[i].last_name);
                manager_ids.push(res[i].id);
            }
        });

        db.query(sql2, (req, res) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: 'What is the first name of the new employee?',
                    validate: first => {
                        if (first) {
                            return true;
                        } else {
                            console.log('Please first name of the new employee.');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'last',
                    message: 'What is the last name of the new employee?',
                    validate: last => {
                        if (last) {
                            return true;
                        } else {
                            console.log('Please last name of the new employee.');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What role does this new employee have?',
                    choices: () => {
                        for (var i = 0; i < res.length; i++) {
                            roles.push(res[i].title);
                        }
                        return roles;
                    }
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'What manager does this new employee fall under?',
                    choices: managers
                }
            ])
            .then(inputs => {
                const sql3 = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === inputs.role) {
                        inputs.role_id = res[i].id;
                    }
                }

                for (var i = 0; i < managers.length; i++) {
                    if (managers[i] === inputs.manager) {
                        inputs.manager_id = manager_ids[i];
                    }
                }

                if (inputs.manager === 'None') {
                    inputs.manager_id = null;
                }

                db.query(sql3, [inputs.first, inputs.last, inputs.role_id, inputs.manager_id], (err, result) => {
                    console.log('\n');
                    
                    if (err) {
                        console.log(err);
                    } else {
                        console.table(`Employee ${inputs.first} ${inputs.last} has been successfully added.`);
                    }
                    
                    console.log('\n');
                    this.menu();
                });
            });
        });
    }

    updateEmployeeRole() {
        const sql1 = `SELECT * FROM employees;`;
        const sql2 = `SELECT * FROM employee_role;`;
        let employees = [];
        let employee_ids = [];
        let roles = [];

        db.query(sql1, (req, res) => {
            for (var i = 0; i < res.length; i++) {
                employees.push(res[i].first_name + ' ' + res[i].last_name);
                employee_ids.push(res[i].id);
            }
        });

        db.query(sql2, (req, res) => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee needs their role updated?',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee’s new role?',
                    choices: () => {
                        for (var i = 0; i < res.length; i++) {
                            roles.push(res[i].title);
                        }
                        return roles;
                    }
                }
            ])
            .then(inputs => {
                const sql3 = `UPDATE employees SET role_id = ? WHERE id = ?`;

                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === inputs.role) {
                        inputs.role_id = res[i].id;
                    }
                }

                for (var i = 0; i < employees.length; i++) {
                    if (employees[i] === inputs.employee) {
                        inputs.id = employee_ids[i];
                    }
                }

                db.query(sql3, [inputs.role_id, inputs.id], (err, result) => {
                    console.log('\n');
                    
                    if (err) {
                        console.log(err);
                    } else {
                        console.table(`Employee ${inputs.employee} has had their role successfully updated to ${inputs.role}.`);
                    }
                    
                    console.log('\n');
                    this.menu();
                });
            });
        });
    }

    allRoles() {
        const sql = `SELECT employee_role.id, employee_role.title, employee_role.salary,
                     departments.name AS department FROM employee_role
                     LEFT JOIN departments ON employee_role.department_id = departments.id;`
        ;

        db.query(sql, (req, res) => {
            console.log('\n');
            console.table(res);
            console.log('\n');
            this.menu();
        });
    }

    addRole() {
        const sql = `SELECT * FROM departments;`;

        db.query(sql, (req, res) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What will be the title of the new role?',
                    validate: title => {
                        if (title) {
                            return true;
                        } else {
                            console.log('Please provide the title of the new role.');
                            return false;
                        }
                    }
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'What will be the salary of the new role?',
                    validate: salary => {
                        if (salary) {
                            return true;
                        } else {
                            console.log('Please provide the salary of the new role.');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department does this new role fall under?',
                    choices: () => {
                        let departments = [];
                        for (var i = 0; i < res.length; i++) {
                            departments.push(res[i].name);
                        }
                        return departments;
                    }
                }
            ])
            .then( inputs => {
                const sql2 = `INSERT INTO employee_role (title, salary, department_id) VALUES (?,?,?)`;

                for (var i = 0; i < res.length; i++) {
                    if (res[i].name === inputs.department) {
                        inputs.department_id = res[i].id;
                    }
                }

                db.query(sql2, [inputs.title, inputs.salary, inputs.department_id], (err, result) => {
                    console.log('\n');
                    
                    if (err) {
                        console.log(err);
                    } else {
                        console.table(`The ${inputs.title} role has been successfully created.`);
                    }
                    
                    console.log('\n');
                    this.menu();
                });
            });
        });
    }

    allDepartments() {
        const sql = `SELECT * FROM departments;`;

        db.query(sql, (req, res) => {
            console.log('\n');
            console.table(res);
            console.log('\n');
            this.menu();
        });
    }

    addDepartment() {
        inquirer.prompt({
            type: 'input',
            name: 'department',
            message: 'What will be the name of the new department?',
            validate: department => {
                if (department) {
                    return true;
                } else {
                    console.log('Please provide the name of the new department.');
                    return false;
                }
            }
        })
        .then( input => {
            const sql = `INSERT INTO departments SET ?`;

            db.query(sql, {name: input.department}, (err, res) => {
                console.log('\n');
                    
                if (err) {
                    console.log(err);
                } else {
                    console.table(`The ${input.department} role has been successfully created.`);
                }
                
                console.log('\n');
                this.menu();
            });
        });
    }
};

module.exports = Tracker;
