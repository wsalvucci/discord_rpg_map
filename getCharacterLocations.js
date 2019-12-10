const query = require('./sqlQuery')
const app = require('./expressApp')

var response = {
    'status': 'OK',
    'message': '',
    'data': []
}



app.get('/characterLocations', function(req, res) {
    query('select c.character_id, c.name, l.x, l.y from characters c inner join character_location cl on c.character_id = cl.character_id inner join location l on cl.location_id = l.location_id',[]).then(data => {
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
