const db = require('../db/connection');

class Tracker {
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

module.exports = Tracker;
