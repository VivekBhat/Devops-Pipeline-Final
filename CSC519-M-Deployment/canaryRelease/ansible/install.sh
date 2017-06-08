#!/bin/bash

sudo apt-get update
# Basic dev deps
sudo apt-get -y install git make vim python-dev python-pip libffi-dev libssl-dev libxml2-dev l$
#install ansible, setuptools, dopy
# Ansible, setuptools, dopy
sudo pip install ansible==2.2.0
sudo pip install -U pip setuptools==11.3
sudo pip install dopy==0.3.5


#generate keys if not already exists
 cat /dev/zero | ssh-keygen -q -N ""
#public key available outside so can add in digitalOcean dashboard, do_create.js, do_destroy.js
cp ~/.ssh/id_rsa.pub ./../id_rsa.pub


#install node.js
sudo apt-get update
sudo apt-get install nodejs -y
sudo apt-get install npm -y
sudo ln -s /usr/bin/nodejs /usr/bin/node

#install redis-server
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo apt-get install -y tcl
sudo make install

#haProxy
sudo add-apt-repository ppa:vbernat/haproxy-1.6
##### must add an enter command here##########
#cat <(echo "") | <command>
##############################################
sudo apt-get update
sudo apt-get -y install haproxy
sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.original
