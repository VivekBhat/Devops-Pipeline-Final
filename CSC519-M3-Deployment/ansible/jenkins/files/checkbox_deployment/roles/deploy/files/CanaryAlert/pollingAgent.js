var redis = require('redis')
var http = require('http')
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var polling_agent = setInterval(function () {

	var request = http.get('http://localhost:8081/', function (res) {
	})
	request.on('error', function (e) {
		console.log("ALERT - Canary Died");
		client.sismember("serverset", 8081, function (err, reply) {
			if (err) throw err;
			if (reply) {
				client.srem("serverset", 8081);
				client.lrem("serverlist", -1, 8081);
				console.log('Removing Canary from Load Balancer');
			}
		});

	});
	request.on('response', function (res) {
		console.log("NO ALERT - Canary Running");
		client.sismember("serverset", 8081, function (err, reply) {
			if (err) throw err;
			if (!reply) {
				console.log('Adding Canary in Load Balancer');
				client.sadd("serverset", 8081);
				client.lpush("serverlist", 8081);
			}
		});

	});
}, 3000);