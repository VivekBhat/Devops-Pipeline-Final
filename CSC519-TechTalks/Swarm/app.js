var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
//var client = redis.createClient(6379, '127.0.0.1', {})
var id = Math.floor(Math.random()*1000)

///////////// WEB ROUTES
app.get('/', function (req, res) {
	res.writeHead(200, { 'content-type': 'text/html' });
	res.write('<h1>Hello world</h1>')
	res.write(`Serving from container: ${id}`);
	res.end();
})

// HTTP SERVER
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

