const query = require('./sqlQuery')

for (var x = -480; x <= 480; x++) {
    for (var y = 270; y >= -270; y--) {
        query('INSERT INTO location (x, y) VALUES (?, ?)',[x, y]).then(data => {
            console.log(x, y)
        }, err => {
            console.error(err)
        })
    }
}