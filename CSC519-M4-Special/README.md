# CSC519-M-Special

## Team Members:
	
  - Shaurya Garg (sgarg7)
  - Seyedsami Mirhosseini Ghamsari (smirhos)
  - Vivek Bhat (vbhat)
  - Nikhila Balaji (nbalaji)

### Intro
Scaling your application aggresively would increase your performance, right? WRONG

For this milestone we focus on checkbox.io, and we want to analyze the performance of the webapp with running different number of instances.
You might think if we just simply scale to run 10 instances of checkbox.io on one server, we will get better performance and use all available resources of that server. But it's not that simple. For example initially we tried to benchmark checkbot.io with one instance vs three instances running on one VCL instance (Dockerized implementation). Here is the results we got:
``` bash
sudo apt-get install apache2-utils # Install benchmarking utility
ab -k -n 50000 -c 1000 -t 60 http://<IP>:8080/studies.html | grep "Requests per second:" >> results.txt

# Results: 
# For 3 instances: Requests per second:   112.53 [#/sec] (mean)
# For 1 instance:  Requests per second:   119.63 [#/sec] (mean)
```
This led us to think what could be the reason. So we decided to run a simple server monitoring system to see if this happens because of CPU/RAM/IO or network bottleneck. We used `glances` to have a look at these metrics while running the benchmark. 
``` bash
sudo apt-get install glances
```
Looking at these metrics, we found on VCL we reach the network limit even with one instance. So we switched to digital ocean for benchmarking. 
_Note: For all of these benchmarks we sent all requests from a digitalocean droplet to overcome our slow local internet speed._

We provisioned two digitalocean droplets. A big one (4 core / 8GB) and a small one (1 core / 512mb). We deployed checkbox.io on both of these servers and we ran benchmark on each one. Bellow is what our results look like: 

#### Small droplet
|            	| 1 replica 	| 3 replica 	|
|------------	|-----------	|-----------	|
| No proxy   	|     1800-2400 |  1800-2400   	|
| http-proxy 	|     70-300	|   70-300  	|

We could clearly see that the `http-proxy` npm package was the bottleneck itself. After researching about this issue we found this [open issue](https://github.com/nodejitsu/node-http-proxy/issues/1058) on their github which has a complete analysis of `http-proxy`'s poor performance. Then we wanted to improve the performance and we [found a way](https://github.ncsu.edu/smirhos/CSC519-M-Special/blob/master/HAProxy.md) to change our infrastructure a bit to use `haproxy` which is designed for production and high performance applications. We tested this on our big droplet and we got this results:

#### Big droplet
|            	| 1 replica 	| 3 replica 	|
|------------	|-----------	|-----------	|
| No proxy   	|   3500-4400   |    3500-4400  |
| http-proxy 	|     700-1100  |    700-1100   |
| HAProxy    	| 2400-3000     |    2400-3000  |

As the results show, HAProxy performance is comparable to running the webapp without a proxy. While `http-proxy` is 10x slower in some cases. It is interesting that even with `HAProxy` we didn't have any improvement in performance which we think might be because of a database (mongodb) bottleneck.

### Conclusion
`http-proxy` is ok for development but is really not designed for production. It uses Node.js and is not multi-threaded. For production it is better to use a better proxy like `HAProxy` which is designed with goal of being high performance and very configurable. We could technically design a proxy with Node.js with multi processes but it doesn't worth the effort and in best case it will perform just as good as `HAProxy`.

### Takeaway lessons
If your application has an internal bottleneck (in its own code), scaling it might help with the performance. But if the bottleneck is in some other place (for ex. db, availability of local resources, or even the load balancer), at best you get the same performance after  scaling.

### Deployment
 ``` bash
 ansible-playbook -i inventory --private-key=<keyfile> -u <username> main.yml -e "GIT_HASH=<git_hash> git_id=<git_username> git_token=<git_token>"
 ```
 
### Links to previous Milestones

* Milestone 1 - [Configuration Management](https://github.ncsu.edu/smirhos/CSC519-M-CM)
* Milestone 2 - [Build Test Analysis](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis)
* Milestone 3 - [Deployment](https://github.ncsu.edu/smirhos/CSC519-M3)

### Screencast

Link to the screencast: 

[https://youtu.be/vpDU3EG0PJM](https://youtu.be/vpDU3EG0PJM)
