var redis = require('redis')
var express = require('express')
var app = express()
var http = require('http'),
	httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var port_num = 8080
var server_list = [];
var server = http.createServer(function (req, res) {
	client.rpoplpush("serverlist", "serverlist", function (err, item) {
		port = item;
		console.log("Request Served By Port " + port)
		proxy.web(req, res, {
			target: 'http://localhost:' + port
		});
	})
});
client.sismember("serverset", 8080, function (err, reply) {
	if (err) throw err;
	console.log(reply);
	if (!reply) {
		console.log('ADDING IN SET');
		client.sadd("serverset", 8080);
		client.lpush("serverlist", 8080);
	}
});
console.log("Load Balancer listening on port 3000")
server.listen(3000);