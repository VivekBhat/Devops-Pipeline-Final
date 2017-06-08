# Docker Swarm:
### Screencast: 
[LINK](https://youtu.be/h0rtDouQrq0)  

### Demo steps:
1. Vagrant is running N virtual machine.
2. Swarm init -> Adding VMs to swarm
    ``` bash
    docker swarm init --advertise-addr <MANAGER-IP>
    ```
3. Showing docker swarm nodes:
    ``` bash
    docker node ls
    ```
4. Execute service (v1)
    ``` bash
    docker service create --replicas 1 --name node-app -p 3000:3000 --update-delay 10s --update-parallelism 1 shauryagarg2006/nodedemoapp:v1
    ```
    Note: 
      - `--update-delay` sets delay between updating each container.
      - `--update-parallelism` sets how many containers to update at the same time.
      - _Limitation:_ We had to push our docker image to Docker hub. Running local images was a pain.

5. Shows the service running:
    ``` bash
    docker service inspect node-app --pretty
    ```

6. At this point there is only one container created which is accessible from all nodes.

7. Run this to see that only container which is currently running
    ``` bash
    docker ps
    ```

8. Scalling:
    ``` bash
    docker service scale node-app=10
    ```

9. Now we have 10 replica:
    ``` bash
    docker service inspect node-app --pretty
    ```

10. Now if you kill one of containers, swarm will automatically recreate more containers:
    ``` bash
    docker ps
    docker stop <ID>
    docker service inspect node-app --pretty # This will show it still has 10 replica
    ```

11. Demo load balancer:
    - Open browser and go to: `http://192.168.33.10:3000`. 
    - If you reload few times you will see the container id is changing which shows the automatic load balancing.

12. Demo rolling updates:
    ``` bash
    docker service update --image shauryagarg2006/nodedemoapp:v2 node-app
    ```

13. Open browser and go to: `http://192.168.33.10:3000`, after reloading few times you will see v2 of the demo app.

    Note: Remember, the containers are updating one by one. with 10s delay between each update.

14. Demo maintanance command: `Drain`
    ``` bash
    docker node ls # --> get one of the IDs
    docker node update --availability drain <ID>
    ```
