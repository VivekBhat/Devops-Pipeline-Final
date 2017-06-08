## Deploying checkbox.io with ansible script

### Infrastructure
  - **Nginx Server:**
    - Nginx is used to host the static content for the checkbox.io
  - **MongoDB Database:**
    - MongoDB is used as the database for storing the data for the website.
  - **NodeJs/Express Server:**
    - An API server keeps running on a different port and exposes a rest api for the static website to consume. Nginx uses reverse proxy to connect to this API server.
  - **How configurations are set?**
    - Ansible on the ansible control machine will connect to the inventory servers with ssh and run the following roles:
      - **node:** Installs nodeJs on the remote machine.
      - **mongodb:** Installs the mongodb database and also pythin-pip and pymongo which are required by ansibles mongodb module.
      - **nginx:** Installs nginx server on the remote machine.
      - **deployment:** Clones checkbox.io, Create mongodb user & password, do an NPM install in the node directory, update the nginx config and restart it, run the node API server using forever.
        - After this step you should be able to open `http://192.168.33.100/` and use checkbox.io .

### Source Code
[Checkbox.io Repository](https://github.ncsu.edu/smirhos/checkbox.io)

### Instructions for deployment:
**VM:**</br>
I provided a Vagrantfile with needed network configuration

**Ansible control machine:**</br>
Ansible control machine is the box which has the provate key of the VM(s) and has ansible installed on it.
  - _Ansible installation instructions [here](http://docs.ansible.com/ansible/intro_installation.html)_

**Provisioning the inventory and deploying checkbox.io:**</br>
To provision the inventory run the following command:
``` bash
ansible-playbook --private-key=~/.ssh/nodes_rsa -u vagrant main.yml -e "GIT_USER=<unity_id> GIT_TOKEN=<github_token>"
```
  - _--private-key={{path to your VM(s) private key}}_ 
  - _-u {{remote_user}}_
  - _-e "GIT_USER={{unity_id}} GIT_TOKEN={{github_token}}"_

Now you can use checkbox.io if you open this in the browser: `http://192.168.33.100/` </br>
[Note: You can update the variables in ansible script (roles/deployment/vars/main.yml) to configure installation paths and mongoDb credentials and other application configurations]

### Report/Experience

checkbox.io deployment automation gotchas:
  - Working with credentials is really difficult. You cannot store them as part of the ansible script and keeping them in ones environment variables adds a manual step in the process. I found passing them as command line arguments to be the best way to deal with them.
  - Working with/modifying the config file for nginx was a little tricky. I think for that purpose using the template module provided by ansible makes things cleaner and easy.
  - Creating credentials was also a little difficult and using the ansible module helped. The downside of this was we ended up installing python-pip and pymongo module as the ansible's mongo module had them as dependency.
  - Working with and creating environment variables at the remote node is also very difficult. Ansibles environment attribute helped us out but it took us while to get it to work.

###Screencast

* [Link to screencast](https://youtu.be/flra04SFnjA): Enable video subtitle for description
