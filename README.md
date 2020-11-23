
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
then run `sudo docker build -t "app".` in image floder.
you can see a `app` image in docker by this command `sudo docker images`
then you can run this image in docker 
`sudo docker run -t -i  -p 8888:8877 app  http://ckplanet.beihanguni.cn:8114/rpc  --spring.data.mongodb.uri=mongodb://172.17.0.1:27018/user   /bin/bash`
note: 
- `http://ckplanet.beihanguni.cn:8114/rpc`:is the ckb rpc address
- `spring.data.mongodb.uri=mongodb://172.17.0.1:27018/user`:is the mongodb address
- `8888:8877`:you can access the data server by port `8888`

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


