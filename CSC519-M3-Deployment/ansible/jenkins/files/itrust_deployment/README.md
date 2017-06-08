## Deploying iTrust with ansible script

### Infrastructure
  - **MySQL server:**
    - MySQL server runs on the sever directly.
  - **Tomcat server:**
    - Tomcat server runs in docker. We built a custom docker image for iTrust which has all the configurations needed.
  - **How configurations are set?**
    - Ansible on the ansible control machine will connect to the inventory servers with ssh and run the following roles:
      - **mysql:** Installs MySQL and configures it to allow remote connections.
      - **jdk:** Installs java 8, maven, and other related dependencies.
      - **install-docker:** Installs docker, docker compose and other related dependencies.
      - **deploy:** Clones iTrust, builds the docker image and runs docker compose.
        - After this step you should be able to open `localhost:8080/iTrust` and use iTrust.
  - **Gluing it all to gether?**
    - _For production deployment_, we used **[docker swarm](https://docs.docker.com/engine/swarm/)** which will add rolling update and load balancing functionality for us.  
    - Note, per requirements, we hard coded 5 replicas for iTrust but docker swarm mode allows changing number of replicas by just running running one command!

_Note: Our private iTrust repo: [here](https://github.ncsu.edu/smirhos/iTrust-v23)_

### Instructions for deployment:
**VM:**</br>
The Vagrantfile with needed network configuration is provided.

**Ansible control machine:**</br>
Ansible control machine is the box which has the provate key of the VM(s) and has ansible installed on it.
  - _Ansible installation instructions [here](http://docs.ansible.com/ansible/intro_installation.html)_

**Provisioning the inventory and deploying iTrust:**</br>
To provision the inventory run the following command:
``` bash
ansible-playbook -i inventory --private-key=~/.ssh/nodes_rsa -u "<user_name>" main.yml -e "git_id=<unity_id> git_token=<github_token>"
```
  - _--private-key={{path to your VM(s) private key}}_ 
  - _-u {{remote_user}}_
  - _-e "git_id={{unity_id}} git_token={{github_token}}"_

Now you can use iTrust if you open this in the browser: `localhost:8080/iTrust` </br>

**Docker Swarm mode:**</br>
Docker swarm will create a docker service which will run on deployment server of itrust. This docker swarm will have 5 replicas and automatically do load balancing. If you run this ansible script multiple time it will trigger the rolling update functionality.

### Screencast:  

* [Link to screencast](https://youtu.be/9zDx4AShGT8): Enable video subtitle for description


#### Useful sources for writing the scripts: 
Docker: 
  - https://blog.jayway.com/2015/03/21/a-not-very-short-introduction-to-docker/
  - http://stackoverflow.com/a/31753726
  - And few stackoverflow answers

Ansible:
  - MySQL role: https://github.com/chrisparnin/skycode/blob/master/db/mysql/mysql.yml
  - Ansible documentation
