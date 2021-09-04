const cTable = require('console.table');
const db = require('../db/connection');

class Queries {

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
            return res;
        });

    }
    
    test() {
        this.test2();
    }

    test2() {
        db.promise().query("SELECT 1")
        .then( ([rows,fields]) => {
            console.log(rows);
        })
        .catch(console.log)
        .then( () => db.end());
        // .then(console.log('testing2v1'));
        console.log('testing2v2');
    }

    test3() {
        console.log('test3');
    }
};

module.exports = Queries;