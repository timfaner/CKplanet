
##  Data Server
### About Data Server
data server provide service for dapp and communicates with the ckb chain
### How to Install
**you should install docker in your machine before install**
#### install mongodb
pull a mongodb image in docker `sudo  docker pull mongo:latest`
if success,you can see
```
latest: Pulling from library/mongo
171857c49d0f: Pull complete 
419640447d26: Pull complete 
61e52f862619: Pull complete 
892787ca4521: Pull complete 
06e2d54757a5: Pull complete 
e2f7d90822f3: Pull complete 
f518d3776320: Pull complete 
feb8e9d469d8: Pull complete 
e70918e624e3: Pull complete 
cfd619253c19: Pull complete 
b4be7d0f542e: Pull complete 
b1ee54282adf: Pull complete 
Digest: sha256:7aa0d854df0e958f26e11e83d875d0cccc53fab1ae8da539070adfc41ab58ace
Status: Downloaded newer image for mongo:latest
docker.io/library/mongo:latest
```
then run mogodb 
```
 sudo  docker run -itd --name mongos -p 27018:27017 mongo
```
if success,you can see
```
ubuntu@ckplanet:~/filer-server-docker$ sudo  docker run -itd --name mongos -p 27018:27017 mongo
33822c78562d293a231024f848905ab7ff7372d2af77c0530a0f600851450537
```
enter mogodb and create a user database

```
sudo docker exec  -it mongos mongo
MongoDB shell version v4.4.2
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("47e1afde-cb97-42a2-94ed-302f138cef4d") }
MongoDB server version: 4.4.2
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
	https://docs.mongodb.com/
Questions? Try the MongoDB Developer Community Forums
	https://community.mongodb.com
---
The server generated these startup warnings when booting: 
        2020-11-23T03:34:29.112+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
        2020-11-23T03:34:29.902+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
        2020-11-23T03:34:29.902+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
---
---
        Enable MongoDB's free cloud-based monitoring service, which will then receive and display
        metrics about your deployment (disk utilization, CPU, operation statistics, etc).

        The monitoring data will be available on a MongoDB website with a unique URL accessible to you
        and anyone you share the URL with. MongoDB may use this information to make product
        improvements and to suggest MongoDB products and deployment options to you.

        To enable free monitoring, run the following command: db.enableFreeMonitoring()
        To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
---
> 
> 
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> use  user
switched to db user
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> use  user
switched to db user
> show  dbs
admin   0.000GB
config  0.000GB
local   0.000GB
user    0.000GB
```
#### run data server
make a floder and enter it.
``
mkidir image & cd image
``
create a Dokcerfile
```
touch Dockerfile
```
copy this txt into the Dockerfile

```bash 
FROM java:8-alpine
ADD  file-server-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```
copy the `file-server-0.0.1-SNAPSHOT.jar` into image floder

then run `sudo docker build -t "app".` in image floder,if success you can see
```
Sending build context to Docker daemon  43.86MB
Step 1/4 : FROM java:8-alpine
 ---> 3fd9dd82815c
Step 2/4 : ADD  file-server-0.0.1-SNAPSHOT.jar app.jar
 ---> 03bcc45c1901
Step 3/4 : EXPOSE 8000-9000
 ---> Running in c308ee1026c0
Removing intermediate container c308ee1026c0
 ---> ee73d2e707f5
Step 4/4 : ENTRYPOINT ["java","-jar","/app.jar"]
 ---> Running in 098d17d4c05f
Removing intermediate container 098d17d4c05f
 ---> dd9c1b52ec25
Successfully built dd9c1b52ec25
Successfully tagged app:latest
```

you can see a `app` image in docker by this command `sudo docker images`

then you can run this image in docker 

`sudo docker run -t -i  -p 8888:8877 app  http://ckplanet.beihanguni.cn:8114/rpc  --spring.data.mongodb.uri=mongodb://172.17.0.1:27018/user   /bin/bash`
if success,you can see
```
ubuntu@ckplanet:~/filer-server-docker$ sudo docker run -t -i  -p 8877:8877 data  http://ckplanet.beihanguni.cn:8114/rpc  --spring.data.mongodb.uri=mongodb://1727.0.1:27018/user   /bin/bash
rpc address：http://ckplanet.beihanguni.cn:8114/rpc

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.3.4.RELEASE)

2020-11-23 04:13:55.104  INFO 1 --- [           main] com.example.demo.CkplantApplication      : Starting CkplantApplication v0.0.1-SNAPSHOT on 0fc6740a72f4 with PID 1 (/app.jar started by root in /)
2020-11-23 04:13:55.112  INFO 1 --- [           main] com.example.demo.CkplantApplication      : No active profile set, falling back to default profiles: default
2020-11-23 04:13:56.774  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data MongoDB repositories in DEFAULT mode.
2020-11-23 04:13:56.804  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 21ms. Found 0 MongoDB repository interfaces.
2020-11-23 04:13:57.800  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8877 (http)
2020-11-23 04:13:57.822  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2020-11-23 04:13:57.823  INFO 1 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.38]
2020-11-23 04:13:57.926  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2020-11-23 04:13:57.927  INFO 1 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 2612 ms
2020-11-23 04:13:58.179  INFO 1 --- [           main] org.mongodb.driver.cluster               : Cluster created with settings {hosts=[172.17.0.1:27018], mode=SINGLE, requiredClusterType=UNKNOWN, serverSelectionTimeout='30000 ms'}
2020-11-23 04:13:58.327  INFO 1 --- [72.17.0.1:27018] org.mongodb.driver.connection            : Opened connection [connectionId{localValue:1, serverValue:8}] to 172.17.0.1:27018
2020-11-23 04:13:58.341  INFO 1 --- [72.17.0.1:27018] org.mongodb.driver.cluster               : Monitor thread successfully connected to server with description ServerDescription{address=172.17.0.1:27018, type=STANDALONE, state=CONNECTED, ok=true, minWireVersion=0, maxWireVersion=9, maxDocumentSize=16777216, logicalSessionTimeoutMinutes=30, roundTripTimeNanos=4975208}
2020-11-23 04:13:59.455  INFO 1 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2020-11-23 04:13:59.739  WARN 1 --- [           main] ion$DefaultTemplateResolverConfiguration : Cannot find template location: classpath:/templates/ (please add some templates or check your Thymeleaf configuration)
2020-11-23 04:13:59.955  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8877 (http) with context path ''

```
note: 
- `http://ckplanet.beihanguni.cn:8114/rpc`:is the ckb rpc address
- `spring.data.mongodb.uri=mongodb://172.17.0.1:27018/user`:is the mongodb address,`172.17.0.1` is the docker network address, you can see by `ifconfig`
```
ubuntu@ckplanet:~/filer-server-docker$ ifconfig
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:1fff:fe14:a444  prefixlen 64  scopeid 0x20<link>
        ether 02:42:1f:14:a4:44  txqueuelen 0  (Ethernet)
        RX packets 4515351  bytes 1981720095 (1.9 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5290891  bytes 1191038932 (1.1 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.53.0.5  netmask 255.255.255.0  broadcast 10.53.0.255
        inet6 fe80::20d:3aff:fec7:51de  prefixlen 64  scopeid 0x20<link>
        ether 00:0d:3a:c7:51:de  txqueuelen 1000  (Ethernet)
        RX packets 59155843  bytes 24943057993 (24.9 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 56745533  bytes 12956999015 (12.9 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 8987036  bytes 4986243709 (4.9 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8987036  bytes 4986243709 (4.9 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth6a5df31: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::ccbf:e4ff:feea:2c0b  prefixlen 64  scopeid 0x20<link>
        ether ce:bf:e4:ea:2c:0b  txqueuelen 0  (Ethernet)
        RX packets 191  bytes 60114 (60.1 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 370  bytes 34239 (34.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

vethe6664b6: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::38c1:32ff:fe78:18a2  prefixlen 64  scopeid 0x20<link>
        ether 3a:c1:32:78:18:a2  txqueuelen 0  (Ethernet)
        RX packets 4472493  bytes 2029687927 (2.0 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5234093  bytes 1181191443 (1.1 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```
- `8888:8877`:you can access the data server port `8877` by port `8888`

### How to Use
 1. /v2/getMpk
 - description：return the data server's public key 
 - request method:POST
 - input: 
 - out: 
 - postman case:
 2. /v2/Auth
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:
  2. /v2/postData
 - description： 
 - request method:POST
 - input: 
 - out: 
 - postman case:
   2. /v2/postDataWithoutValid
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:
 2. /v2/getData
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:
 2. /v2/valid
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:


