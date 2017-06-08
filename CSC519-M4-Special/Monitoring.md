In order to monitor the docker containers that we are interested in adn to keep track of relevant metrics, we used two tools:

### Docker Stats
We have checkbox.io deployed in a VCL host machine - at 152.46.18.56
```
docker stats canary_web_server_1 stable_web_server_1
```
#### Screenshot 
![Sample Stats](https://github.ncsu.edu/smirhos/CSC519-M-Special/blob/master/docker_stats.PNG)
### CAdvisor 
```
sudo docker run -d --name=cadvisor_work -p=9000:8080 --volume=/var/run:/var/run:rw --volume=/sys:/sys:ro --volume=/var/lib/docker/:/var/lib/docker:ro  google/cadvisor:latest
```
![Docker containers Cadvisor](https://github.ncsu.edu/smirhos/CSC519-M-Special/blob/master/cadvisor.PNG)

For storage, we have an option to store it in [redis](https://github.com/google/cadvisor/blob/master/docs/storage/README.md)
