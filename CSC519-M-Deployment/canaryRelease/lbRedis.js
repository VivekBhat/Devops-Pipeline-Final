var http = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");
// REDIS - @local host will be vagarnt machine private ip
var redis = require("redis");
var client = redis.createClient(6379, '127.0.0.1', {})

//canary servers added in this array
var canaryServer = ['http://67.205.187.178/'];
//app servers added in this array
var appServer = ['http://67.207.80.215/'];
// Returns a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.lpush("stable", appServer[0]);
client.lpush("canary", canaryServer[0]);

// available list of servers 

var infrastructure = {
	setup: function() {
		// Proxy...
		var proxyServer = http.createServer(function(req, res) {

			if (req.url === '/favicon.ico') {
				res.end();
				console.log('favicon requested ignored \n');
				return;
			} else {

			if(res.statusCode / 100 != 2) {
				console.log(" wrong redirect")


			} else {
				console.log(" we are okay!")
				console.log(res.statusCode + "WHAT!!!")
			}
			
				/**if (getRandomInt(1, 100) >= 80) {
					client.rpoplpush("canary", "canary", function(err, value) {
						var TARGET = value;
						httpProxy.createProxyServer({}).web(req, res, {
							target: TARGET
						})
						console.log("canary version at : ", TARGET)
					});
				} else { **/
					client.rpoplpush("stable", "stable", function(err, value) {
						var TARGET = value;
						httpProxy.createProxyServer({}).web(req, res, {
							target: TARGET
						})
						console.log("stable version at : ", TARGET)
					});
				//}
			}
		});

		console.log("Proxy listening on port 8080")
		proxyServer.listen(8080);

	},
	teardown: function() {
		exec('forever stopall', function() {
			console.log("infrastructure shutdown");
			process.exit();
		});
	},
}

infrastructure.setup();

// Make sure to clean up.
process.on('exit', function() {
	infrastructure.teardown();
});
process.on('SIGINT', function() {
	infrastructure.teardown();
});
process.on('uncaughtException', function(err) {
	console.error(err);
	infrastructure.teardown();
});