var needle = require("needle");
var os = require("os");
var fs = require('fs');
//var sleep = require('sleep');

var config = {};
config.token = process.env.DO;


var headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + config.token
};

var client = {

    listDroplets: function(onResponse) {
        needle.get('https://api.digitalocean.com/v2/droplets', {
            headers: headers,
            json: true
        }, onResponse);
    },
    deleteDroplet: function(dID, onResponse) {
        needle.delete('https://api.digitalocean.com/v2/droplets/' + dID, null, {
            headers: headers,
            json: true
        }, onResponse);
    },
    createDroplet: function(dropletName, region, imageName, onResponse) {
        var data = {
            "name": dropletName,
            "region": region,
            "size": "512mb",
            "image": imageName,
            // Id to ssh_key already associated with account - hash value
            "ssh_keys": [""],
            //"ssh_keys":null,
            "backups": false,
            "ipv6": false,
            "user_data": null,
            "private_networking": null
        };

        //console.log("Attempting to create "+ JSON.stringify(data) );

        needle.post("https://api.digitalocean.com/v2/droplets", data, {
            headers: headers,
            json: true
        }, onResponse);
    },

    createInventory: function(dropletID, onResponse) {
        needle.get("https://api.digitalocean.com/v2/droplets/" + dropletID, {
            headers: headers
        }, onResponse)
    },

};


var servers = ['RedisServer', 'ProxyServer', 'AppServer', 'CanaryServer'];

client.listDroplets(function(err, resp, body) {
    console.log("Inside: ");
    for (i = 0; i < body.droplets.length; i++) {
        dID = body.droplets[i].id;
        dName = body.droplets[i].name;
        if (servers.indexOf(dName) != -1) {
            console.log("Droplet %s's name is: %s and ID is %s ", i + 1, dName, dID);

            client.deleteDroplet(dID, function(err, resp, body) {
                if (err == null) {
                    console.log("deleted: ", dName);
                }
               // console.log(body);
            });
        }

    }
});
