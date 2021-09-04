const inquirer = require('inquirer');
const db = require('../db/connection');

class Tracker {

    menu() {
        inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all employees', 'view employees by department', 'view employees by manager',
                        'add an employee', 'remove an employee', 'update an employee role', 'update employee manager',
                        'view all roles', 'add a role', 'remove a role', 'view all departments',
                        'view the total utilized budget of a department', 'add a department', 'remove a department', 'exit app']
        })
        .then(({ menu }) => {
            switch (menu) {
                case 'view all employees':
                    this.allEmployees();
                    break;
                case 'view employees by department':
                    break;
                case 'view employees by manager':
                    break;
                case 'add an employee':
                    break;
                case 'remove an employee':
                    break;
                case 'update an employee role':
                    break;
                case 'update employee manager':
                    break;
                case 'view all roles':
                    break;
                case 'add a role':
                    break;
                case 'remove a role':
                    break;
                case 'view all departments':
                    break;
                case 'view the total utilized budget of a department':
                    break;
                case 'add a department':
                    break;
                case 'remove a department':
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
            this.menu();
        });

        // db.promise().query(sql)
        // .then( ([rows,fields]) => {
        //     console.log('\n');
        //     console.table(rows);
        // })
        // .catch(console.log)
        // .then( () => db.end());

    }
};

module.exports = Tracker;
