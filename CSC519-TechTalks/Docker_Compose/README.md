# Docker Compose:

## Screencast: [Link](https://www.youtube.com/watch?v=q2UiZ9N5rPU&feature=youtu.be)

## Demo steps:

### Services
	
1. Go to services_demo folder
2. Now build the docker-compose file:
	
	```
	docker-compose build
	```
3. let's run the docker-compose.yml file now:

	```
	docker-compose up
	```
4. Services should be up and running 
5. Run `docker-compose logs`  to see the logs
6. Once done with the services run `docker-compose stop` to stop the running the containers
7. To remove the containers run `docker-compose rm`
	
	

### Networks
1. Go to networks_demo folder
2. Now build the docker-compose file:
	
	```
	docker-compose build
	```
3. let's run the docker-compose.yml file now:

	```
	docker-compose up
	```
4. You should get something like this:

	```
	Starting networksdemo_service1_1
	Starting networksdemo_service3_1
	Starting networksdemo_service2_1
	Attaching to networksdemo_service3_1, networksdemo_service2_1, 	networksdemo_service1_1
	...
	```
	This step can take some time.

5. 	Run ```docker ps``` and you can see that there are now 3 new containers running
	
	![docker_ps_networks](https://github.ncsu.edu/smirhos/CSC519-TechTalks/blob/master/Docker_Compose/Resources/docker_ps_networks.png)

6. Now, run `docker exec -it [NAME of service] bash` to get inside the service container

7. Do `ping service2` to check the connection with service 2
8. Do `ping service3` to check the connection with service 3

follow the same steps for other services as well.


### Volumes

1. Go to volumes_demo folder
2. Now build the docker-compose file:
	
	```
	docker-compose build
	```
3. let's run the docker-compose.yml file now:

	```
	docker-compose up
	```
4. We have mounted the volumes in the local directory `[data:/data]`
5. Run `docker ps` and we have these 2 containers	
   ![docker_ps_volumes](https://github.ncsu.edu/smirhos/CSC519-TechTalks/blob/master/Docker_Compose/Resources/docker_ps_volumes.png)


6. Now, run `docker exec -it [NAME of service] bash` to get inside the service container
7. There will be a folder `data`
7. Do `ls` to see what's in there, nothing as of now
8. Follow same for the service2. 
9. Do `touch test` and it will add the file `test` in the data folder
10. Go inside the other service's `data` folder and you can see the `test` file there too.