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
ansible-playbook -i inventory --private-key=~/.ssh/nodes_rsa -u vagrant main.yml -e "git_id=<unity_id> git_token=<github_token>"
```
  - _--private-key={{path to your VM(s) private key}}_ 
  - _-u {{remote_user}}_
  - _-e "git_id={{unity_id}} git_token={{github_token}}"_

Now you can use iTrust if you open this in the browser: `localhost:8080/iTrust` </br>
[Note: You may need to update the inventory file manualy if you have more than one server or using a different vm than the provided Vagrantfile]

### Report/Experience
I (Sam) had experience with setting up iTrust from csc326 as undergraduate student (last semester). At the end of that course I made a docker image for iTrust but since I didn't have much experience with it, it took about 20 hours of work at that time. Now that we have more experience with docker, we realized that the docker infrastructure that I had wasn't really the best. For example I was manually exporting the war file with eclipse, or I was using MySQL docker container without correct configuration which could cause data loss in case of failure. 

iTrust deployment automation gotchas:
  - Be careful when setting file permissions:
    - When copying files we were setting too restricted file permissions and as a results `mvn package` couldn't create files.
    - When copying mysql `my.cnf` template, we were changing the file permission unknowingly which was causing the configurations to not work.
  - Use roles to group specific/related tasks as much as possible:
    - We realized how beneficial it can be to have a separate role for each specific task. For example we were able to just copy the exact jdk role from my HW1B to here. 
  - Use docker to make life easier! (Not harder)
    - Docker design was initially made of two containers (one for tomcat and one for mysql) which were connected to each other by docker compose configurations. But after automating `mvn package`, since we already had a mysql server running on the server then it was really pointless to make a mysql container again. So we decided to use the mysql server which is installed on server along with my custom tomcat docker image (`itrust-docker/tomcat`).
    - It seems other students had many issues with tomcat configuration, but we only had a few mysql connections refused in the beginning before we figured mysql configuration was not right. Using docker made the process much easier for us and we didn't have to change many configuration files.

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
