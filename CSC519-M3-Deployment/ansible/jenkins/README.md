## About the Jenkins Role - Summary

* Installs git, maven, java8

* Adds ansible Apt Repository
  
* Installs ansible

* Adding apt key for jenkins, check for jenkins list, add jenkins source list, install jenkins
[restarts jenkins and wait]

* Creates a directory for groovy script, copy it for default user
[restart and wait ] 

* Downloads jenkins cli jar

* install jenkins plugins : maven-plugin, github, jacoco, junit, test-stability setting number of executors to 1 [restart and wait]

* check  git credentials in jenkins | copying in xml | adding in jenkins| remove in xml
  
* check ssh key in Jenkins | copying  in xml | adding in jenkins | removing ssh key from xml

* check git webhooks credential in jenkins | copying in xml | adding in jenkins | removing in xml

* Copies [github-plugin-configuration xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/dd4742a4ea386eee7ba22509cfd5acc2971b28c9/ansible/jenkins/files/github-plugin-configuration.xml)
[restart and wait]

* checking Job List for iTrust  

* Copies [itrust.xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/3363793284a2f409979444c009f5788ab5cb2a79/ansible/jenkins/files/itrust.xml)

* create jenkins iTrust job using XML | remove itrust.xml 

* Copies [itrust-fuzzer.xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/3363793284a2f409979444c009f5788ab5cb2a79/ansible/jenkins/files/itrust-fuzzer.xml)

* create jenkins iTrust-Fuzzer job using XML | remove itrust-fuzzer.xml

* Checking joblist for checkbox.io

* Copies [checkbox.io job xml](https://github.ncsu.edu/smirhos/CSC519-M-BuildTestAnalysis/blob/cccceb85be57cd9dc8591a22591e575deae0616e/ansible/jenkins/files/checkbox.xml)

* Create jenkins jobs for checkbox.io using xml | remove checkbox.o xml
  
* Copy Ansible for Checkbox Deployment

* Adding Inventory File Checkbox Deployment
