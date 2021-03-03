const main = require('./index');
const https = require('https');


test('Teste do método Get', () => {
  var options = {
    host: 'http://localhost:3000',
    path: '/pessoas'
  };

  callback = function(response) {    
    response.on('end', function () {      
    });
  }
  expect(http.request(options, callback).end());
});