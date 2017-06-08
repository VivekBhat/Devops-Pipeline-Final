var redis = require('redis')
const child_process = require('child_process')
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var max_port_number = 8080;
var compose_file_path = process.env.HOME + "/Docker";
scaling(process.argv[2]);


function scaling(scale_number) {
	if (scale_number < 0) {
		process.exit();
	}
	client.lrange("serverlist", 0, -1, function (err, item) {
		if (err) throw err;
		if (item) {
			var current_size = item.length;
			max_port_number = Math.max.apply(Math, item);
			max_port_number = Math.max(max_port_number, 8079);
			console.log("Current Cluster Size : " + current_size);
			console.log("Required Cluster Size : " + scale_number);
			if (current_size > scale_number) {
				for (iter = 0; iter < current_size - scale_number; iter++) {
					kill_a_instance();
				}
			}
			if (current_size < scale_number) {
				for (iter = 0; iter < scale_number - current_size; iter++) {
					start_a_instance();
				}
			}
		}
		process.exit();
	});

}

const start_a_instance = () => {
	max_port_number = max_port_number + 1;
	console.log("Starting a new instance on port " + max_port_number);
	child_process.execSync(`cd ${compose_file_path} && export WEB_PORT=${max_port_number} && docker-compose -f DockerCompose.yml -p ${max_port_number} up -d`)
	client.lpush("serverlist", max_port_number);
	console.log("Pushed " + max_port_number)

}

const kill_a_instance = () => {
	console.log("Removing Instance running on port " + max_port_number);
	client.lrem("serverlist", -1, max_port_number);
	child_process.execSync(`cd ${compose_file_path} && export WEB_PORT=${max_port_number} && docker-compose -f DockerCompose.yml -p ${max_port_number} kill`);
	max_port_number = max_port_number - 1;
}
