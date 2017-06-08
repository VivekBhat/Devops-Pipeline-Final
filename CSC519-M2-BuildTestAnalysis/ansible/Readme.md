##Use the following command to run the script:

###USING SSH Keys
ansible-playbook --private-key=**PRIVATE_KEY_LOCATION** -u **REMOTE_USER_NAME** -e "GIT_TOKEN=**GIT_TOKEN_HERE** HOST_IP=**REMOTE/VCL IP**" main.yml



## Jenkins Tasks List - Summary
		
			jenkins/tasks/main.yml

* install git, maven, java8

* Adding apt key for jenkins, check for jenkins list, add jenkins source list, install jenkins
[ restart jenkins and wait]

* create a directory for groovy script, copy it for default user
[restart and wait ] 

* Downloading jenkins cli jar

* install jenkins plugins : maven-plugin, github, jacoco, junit, test-stability setting number of executors to 1 [restart and wait]

* check  git credentials in jenkins | copying in xml | adding in jenkins| remove in xml
  
* check ssh key in Jenkins | copying  in xml | adding in jenkins | removing ssh key from xml

* check git webhooks credential in jenkins | copying in xml | adding in jenkins | removing in xml

* copying [github-plugin-configuration xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/dd4742a4ea386eee7ba22509cfd5acc2971b28c9/ansible/jenkins/files/github-plugin-configuration.xml)
[restart and wait]

* checking Job List for iTrust  

* copying [itrust.xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/3363793284a2f409979444c009f5788ab5cb2a79/ansible/jenkins/files/itrust.xml)

* create jenkins iTrust job using XML | remove itrust.xml 

* copying [itrust-fuzzer.xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/3363793284a2f409979444c009f5788ab5cb2a79/ansible/jenkins/files/itrust-fuzzer.xml)

* create jenkins iTrust-Fuzzer job using XML | remove itrust-fuzzer.xml

* checking joblist for checkbox.io

* copying [checkbox.io job xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/cccceb85be57cd9dc8591a22591e575deae0616e/ansible/jenkins/files/checkbox.xml)

* create jenkins jobs for checkbox.io using xml | remove checkbox.o xml
  
