const query = require('./sqlQuery')
const app = require('./expressApp')

var response = {
    'status': 'OK',
    'message': '',
    'data': []
}



app.get('/locations', function(req, res) {
    query('SELECT * FROM location l left join (SELECT * FROM place) p on p.place_id = l.place_id',[]).then(data => {
        response['message'] = 'Location data retrieved'
        response['data'] = data
        res.send(response)
    }, err => {
        response['status'] = 'FAIL'
        response['message'] = 'Failed getting location data'
        response['data'] = err
        res.send(response)
    })
})
