## Use the following command to run the script:

``` bash
ansible-playbook -i inventory --private-key=<ssh_key_location> -u <remote_user> main.yml -e "HOST_IP=<jenkins_ip> git_id=<git_user_id> git_token=<git_token> ITRUST_IP=<ip_address> CHECKBOX_IP=<ip_address>"
```

This ansible script will install jenkins on CI server with a build job for itrust/checkbox.io and also copy the deplyment script to jenkins server. Jenkins will use deployment scripts to deploy a new version of itrust (rolling update) /checkbox.io (Canary) if the build was successful.
