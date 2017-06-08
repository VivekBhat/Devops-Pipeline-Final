#### To get Haproxy up and running following steps need to be followed after running the ansible scripts:
1. `sudo apt-get update`
2. `sudo apt-get install haproxy`
3. `Edit the configuration file as given below`
##### To kill the http-proxy will be running by default after the ansible scripts 
1. `forever list`
2. Do `forever stop pid` for the loadbalancer.js

#### Following configuration was added in `/etc/haproxy/haproxy.cfg`
```
global
    log 127.0.0.1 local0 notice
    maxconn 10000
    user haproxy
    group haproxy
defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    retries 3
    option redispatch
    timeout connect  5000
    timeout client  10000
    timeout server  10000
listen appname 0.0.0.0:80
    mode http
    stats enable
    stats uri /haproxy?stats
    stats realm Strictly\ Private
    stats auth admin:admin
    balance roundrobin
    option httpclose
    option forwardfor
    server web1 127.0.0.1:8080 check
    server web2 127.0.0.1:8081 check
    server web3 127.0.0.1:8082 check
```
#### Another Script for restart with minimum down time was used
```
sleep 5
sudo iptables -I INPUT -p tcp --dport 80 --syn -j DROP
sleep 1
sudo service haproxy restart
sudo iptables -D INPUT -p tcp --dport 80 --syn -j DROP
```
[Script Source](https://serverfault.com/questions/580595/haproxy-graceful-reload-with-zero-packet-loss)
