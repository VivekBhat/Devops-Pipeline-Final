# CSC519-M3

## Team Members:
	
  - Shaurya Garg (sgarg7)
  - Seyedsami Mirhosseini Ghamsari (smirhos)
  - Vivek Bhat (vbhat)
  - Nikhila Balaji (nbalaji)
## Task:

https://github.com/CSC-DevOps/Course/blob/master/Project/M3.md
#### Deployment - Checkbox.io and iTrust
We will first run the installation of jenkins server on the first VCL instance. We have a git hook that will be triggered after a git push to either to checkbox.io repo or itrust repo. The git hook will create a jenkins build job on the VCL instance. After a successful build, the project will be deployed to another VCL instance. The VCL instance IPs are passed in during the installation of Jenkins Server.
![overview](https://github.ncsu.edu/smirhos/CSC519-M3/blob/master/resources/deploy.png)

#### Infrastructure Upgrade - Checkbox.io
Load Balancer is implemented as a part of the infrastructure upgrade. Plus, a master and slave paradigm of the redis servers has been created. There is a master redis server in a container on its own. And every instance is a result of a docker compose among the application, nginx server and a redis instance.


#### Canary Release - Checkbox.io
As mentioned in the **Deployment** section - a git push to the checkbox.io repo will make jenkins server deploy it on the provided vcl ip. Checkbox.io is deployed used docker containers as shown below - the application, nginx, and redis instance are each separte containers. We also create a redis master and mongo container since they will be shared among the canary and the stable instance. A second push creates the canary instance. 
`pollingAgent.js` - periodically polls and checks if all the deployed instances are running. If any instance is not responding, it removes it from the load balancer. If the failed instance happens to be working during another poll, it will add it back to the load balancer.
`loadBalancer.js` - a proxy server that redirects requests to available instances.

*Other Approaches*  - Also tried deploying checkbox.io on digital ocean droplets and creating a load balancer with http-proxy and HAProxy. These attempts can be observed [here](https://github.ncsu.edu/smirhos/CSC519-M-Deployment) in canary folder
![canary](https://github.ncsu.edu/smirhos/CSC519-M3/blob/master/resources/canary.png)


#### Rolling Update
As shown every replica of iTrust is a container. Each iTrust container is composed of the application and the Tomcat Server container. The replicas share the MySQL container connection.  We make use of the docker-swarm to implement rolling update. There is a master container that controls the other slave replicas of iTrust - it upgrades each instance one after another with a 60 second delay. 
![rollingUpdate](https://github.ncsu.edu/smirhos/CSC519-M3/blob/master/resources/rollingUpdate.png)


## Sceencasts
We created three different screencasts to show all the tasks in the milestone. They are grouped by project category.

* [Installation of Jenkins Server - Jenkins Jobs creation](https://youtu.be/vgifNaqDV6c)

* [Checkbox.io - deploy, infrastructure upgrade - feature flag, load balancing, canary release](https://youtu.be/yjw-pSac-JE) 

* [iTrust - deploy, and rolling update](https://youtu.be/tye-sXVvxe4)

