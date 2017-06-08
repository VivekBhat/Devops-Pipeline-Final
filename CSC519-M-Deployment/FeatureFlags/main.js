var redis = require('redis')
var multer = require('multer')
var express = require('express')
var fs = require('fs')
var app = express()
var redisServer = fs.readFileSync("../ansible/redis.json");
var redisDetails = JSON.parse(redisServer);
// var client 		= redis.createClient(6379, '127.0.0.1', {})
var client = redis.createClient(parseInt(redisDetails.redisPort), redisDetails.redisIp, {})

///////////////////////////
///////////// WEB ROUTES
///////////////////////////

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) {
    next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
    res.send('Welcome to the Feature Flags Application')
})

app.get('/create/:feature', function(req, res) {

    res.writeHead(200, {
        'content-type': 'text/html'
    });

    client.set(req.params.feature, "Enabled");

    client.lpush('features', req.params.feature, function(err, value) {});

    res.write("New feature created and is enabled by default.");
    res.end();
})

app.get('/listfeatures', function(req, res) {

    res.writeHead(200, {
        'content-type': 'text/html'
    });

    client.llen('features', function(err, value) {
        client.lrange('features', 0, value - 1, function(err, features) {
            res.write('List of available features is ' + features);
            res.end();
        })
    })
})

app.get('/toggle/:feature', function(req, res) {
    res.writeHead(200, {
        'content-type': 'text/html'
    });

    client.get(req.params.feature, function(err, value) {
        if (value === "Enabled") {
            client.set(req.params.feature, "Disabled");
            res.write("Feature has been Disabled");
            res.end();
        } else {
            client.set(req.params.feature, "Enabled");
            res.write("Feature has been Enabled");
            res.end();
        }
    });
});

app.get('/view/:feature', function(req, res) {
    res.writeHead(200, {
        'content-type': 'text/html'
    });

    client.get(req.params.feature, function(err, value) {
        res.write(req.params.feature + " is " + value);
        res.end();
    });
})


// HTTP SERVER
var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port

    var server1 = 'http://{0}:{1}'.format(host, port);
    console.log("Server is listening on " + server1);
});

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}
