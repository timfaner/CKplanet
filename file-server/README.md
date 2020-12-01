##  CKDataBase
### About CKDataBase
CKDataBase provide store service for dapp and validate data hash on  ckb chain.

### Quick start

#### Dependencies
Docker installed

#### Get jar file

Download  jar file named `CKDataBase.jar` from [release](https://github.com/timfaner/CKplanet/releases)  

or

Compile  jar file by your own, and copy jar file into work see [here](#Compile-Jar-file)


#### Put Jar file into work directory
copy jar file into `file-server`, the directory looks like

```shell
./
├── CKDataBase.jar
├── Dockerfile
├── Makefile
├── README.md
├── file-server.iml
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
```

#### Run CKDataBase

```shell
# Init docker
make init

# Start CKDataBase
make start
```

Now CKDataBase runing on `0.0.0.0:8877`


#### Furthermore 
- Set up https reverse proxy  
The ckplanet running under https, due to broswers' sercurity control strategy it can only access resources under https. See [here](https://docs.nginx.com/nginx/admin-guide/security-controls/securing-http-traffic-upstream/) to config https proxy.

- Config CKDataBase  
CKDataBase now works with ckb [aggron testnet](https://explorer.nervos.org/aggron/), change value `CKB_NODE_RPC` in Makefile  can chain it works with.

### Compile Jar file  

- Install [Java](https://www.java.com/download/) and [maven](https://maven.apache.org/install.html)
- In `file-server` directory, run `mvn package`
- The jar file path is  `target/CKDataBase.jar`

