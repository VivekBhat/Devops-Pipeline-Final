## Canary Release

#### Setup:
Set up the ansible control box that will be used for configuring checkbox on the droplets with the Vagrantfile provided.
There is an `Vagrantfile` provided. It runs the `install.sh` script when setting up the VM.
* The script installs ansible and other dev dependencies
* New ssh keys are generated for this control box and the public key file `id_rsa.pub` will be copied on the shared directory /vagrant
~~~~
vagrant up
~~~~
* Copy the contents of the `id_rsa.pub` file and add it on the [DigitalOcean dashboard for SSH keys](https://cloud.digitalocean.com/settings/security)
* Also copy the hash value from the dashboard and add it to line 24 on 'do_create.js' and line 36 on 'do_destroy.js'

#### 1) Provisioning 4 droplets for setting up - RedisServer, ProxyServer, AppServer, CanaryServer
   - AppServer - once configured will have the current/stable version of checkbox.io
   - CanaryServer - once configured will have the slightly modified version of checkbox.io
   - ProxyServer - will handle load balancing between the AppServer and CanaryServer droplets
   - RedisServer - will be responsible for monitoring the CanaryServer
   
  ```
  node do_create.js 
  ```
   
#### 2) Using ansible scripts from milestone 1 to configure the AppServer and CanaryServer
   - There will be a new branch on our forked version of checkbox.io [Canary Branch](https://github.ncsu.edu/smirhos/checkbox.io/tree/canary) 
   - Ansible Scrits from milestone 1 and the roles have been modified/added [Checkbox.io CM](https://github.ncsu.edu/smirhos/CSC519-M-CM/tree/master/checkbox.io)
```
vagrant ssh
ansible-playbook -i inventory  main.yml -e "GIT_USER=<unity_id> GIT_TOKEN=<github_token>"
```
  

#### 3) Load Balancing
   - Majority of the traffic will be directed to AppServer and a small percentage (random sample) will be directed to the CanaryServer
   * http-proxy - deployed on a vagrant control machine, and two droplets AppServer, CanaryServer. Assigned weights with simple math function
   * HaProxy - deployed on three droplets - HaProxyServer, HaPoxyAppServer, HaProxyCanaryServer 
   
#### 4) Monitoring/ Alert
   - When an alert is triggered, the CanaryServer droplet will be taken down and replaced with a new droplet - clone of the AppServer
   * http-Proxy - was having a hard time to use the loadBalancer.js to trigger an alert for and keep track of it.
   * HAProxy - seemed more promising, with ability to modify weights and automatically detect and poll server that are down and redirect traffic to servers that are responding. But I was facing issues writing a config file that was able to start haProxy - the debug logs was difficult since resoruces and documentation seemed scarce thought it seems powerful/easy and feature rich.
   
  [Screen cast of progress and challenges can be found here](https://drive.google.com/open?id=0B-jRC--qQjQYeEl0RVNKVnlJUGM)
  

