const inquirer = require('inquirer');
const db = require('../db/connection');
const Queries = require('./Queries');

class Tracker extends Queries {

    menu() {
        inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all employees', 'view employees by department', 'view employees by manager',
                        'add an employee', 'remove an employee', 'update an employee role', 'update employee manager',
                        'view all roles', 'add a role', 'remove a role', 'view all departments',
                        'view the total utilized budget of a department', 'add a department', 'remove a department']
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
            }
        })
    }
};

module.exports = Tracker;
