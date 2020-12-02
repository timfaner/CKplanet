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
make build

# Start CKDataBase
make start
```

Now CKDataBase runing on `0.0.0.0:8877`


#### Furthermore 
- Set up https reverse proxy  
The ckplanet running under https, due to broswers' sercurity control strategy it can only access resources under https. See [here](https://docs.nginx.com/nginx/admin-guide/security-controls/securing-http-traffic-upstream/) to config https proxy.

- Config CKDataBase  
CKDataBase now works with ckb [aggron testnet](https://explorer.nervos.org/aggron/), change value `CKB_NODE_RPC` in Makefile  can chain it works with.

### API
All API data is sent and received as JSON.

#### Crypto Algorithm
Hash: blake2b,  output 32bits
Signature : Secp256k1
#### Api detail

 1. /v2/getMpk
 - description：Get the CKDataBase's MPK, which is identity of  CKDataBase
 - request method:POST
 - request: 
 ```
 POST /v2/getMpk HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: ckplanet.beihanguni.cn:8877
Connection: close
User-Agent: Paw/3.1.10 (Macintosh; OS X/10.15.7) GCDHTTPRequest
Content-Length: 2

{}
```
 - response:  
 ```
 HTTP/1.1 200 
Connection: close
Transfer-Encoding: chunked
Content-Type: application/json
Date: Sat, 28 Nov 2020 10:41:29 GMT
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers

{"mpk":"03d645d07206207cd8327e0aef11e2cfbfce2e267b1df0fffc4df681ce46d72d2c"}
```


 2. /v2/getAuth
 - description： Get authorization for request 
 - request method:POST
 - request: 

    Request consists of 4 fields.   

    - access_token: string, signature of `msg` 
    - msg: arbitray string  
    - type: string, stands for signature. Valid value is `eth|ckb`
    - cpk: if `type` is `ckb`,  cpk stands for  public key, if `type` is `eth`,  cpk stands for eth address
 ```
 POST /v2/getAuth HTTP/1.1
Content-Type: application/json
Host: localhost:32768
Connection: close
User-Agent: Paw/3.1.10 (Macintosh; OS X/10.15.7) GCDHTTPRequest
Content-Length: 230

{"access_token":"0x01c27033543fbfbbafba270a56de4cfe661be2f511e429ff49bbb273bcf78a3b51f8548dd64b0c11f3ef78f25c2d55758507c5e0a7d71b547aebbf67f0e15f261b","msg":"public","cpk":"0x35ca770bfa06c632085aa6fb782d7b8f534a7f0d","type":"eth"}

```
 - response: 
    Response consists of 4 fields. 
    - code: number , 0 stands for success
    - pk: string, used for sign msg later.
    - sk: string, private key used for sign msg later. __Should keep as secret.__
    - cert : string, used for sign msg later
 ```
 HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 01 Dec 2020 10:00:34 GMT
Connection: close

{"code":0,"pk":"0x03333b06f7b0be0c1b3025ab5e546793fe97082811a71080fbed6400b56376d87b","sk":"0xd8d8b3b223cc2336f830bd9f08cd8376bf6ea4daad2765aaa60de94420c3f1ab","cert":"0x4004ce4f951f26849b0468b42699b81f22426c40110cd34ce6e518b624c817e26b39af9f73cd447bad2ab1e4b75d12cab9a4cd0e126bcae502f382934058ec87"}
```

  3. /v2/postData
 - description： Update data in data base if hash of corresponding data already push on ckb chain.
 - request method:POST
 - request: 
     Request consists of 4 fields.   
    - data_id : string, stands for a kind of data.
    - data: string , data need to be store.
    - access_token: string, same as `access_token` in `getAuth`
    - sig:  string  , signature of data signed by `sk` which obtains in `getAuth`
    - tx_id: string, tx id which cells may contain `dataHash`.
    - dataHash: sting, hash of `data`. Using Blake2B, same as hash put on ckb chain.
    - pk: `pk`  obtains in `getAuth`
    - cert: `cert`  obtains in `getAuth`

 ```
 POST /v2/postData HTTP/1.1
Proxy-Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36
DNT: 1
Accept: */*
Origin: http://localhost:8080
Referer: http://localhost:8080/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
content-type: application/json
Host: localhost:8888
Connection: close
Content-Length: 5895

{"data_id":"1",
"data": "data_to_send",
"access_token":"0x68535c70b2da27e8a0b58670958d4d57a5c4162dec070e45fbadfda1fc9ce4bf3c7242b49242220df87dc16a3737087357e765f09e570726f1377412587e3ae7",
"sig":"0x433a74d64bce91ce83ee74f88e2151ee6df8edc7e821ffc37c7452296d022125254057d63993b51a8ad904344f7c706f158d525007d0b984b88b2cf68b834453",
"tx_id":"0x242e54345a35aa0bb3df03c648e5036cb0d906f9364e64fd40d0db7e805fa74b",
"dataHash":"0x42d580db5713c19f1668b798236733aacefb95f673e4b8261ac2ae7fb6278d26",
"pk":"0x028c17b6e9523dda8f14e515961e177ab6b0c6e5da9e9ecd8746c1db39e2ee5bc4",
"cert":"0x91b9d467029daf88f116c7610fe4a8255418c806981ded390cd5ff78d6f190f116e718b8328ff74d77eb6ca3a314714d273a045ca30ff1f03a9b7772d6c92004"}

 ```
 - response: 
     Response consists of 4 fields. 
    - code: number , 0 stands for success
    - url: string, used for access data later.
    - state: null , useless now
    - ticket : null, useless now

```
HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Access-Control-Allow-Origin: *
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 01 Dec 2020 08:00:39 GMT
Connection: close

{"code":0,"url":"0xeb5a49cdfac5b96593e8136261889013a2133a29fd367f6d20a68c23f4989d1e","state":null,"ticket":null}
```
   4. /v2/postDataWithoutValid
 - description：Update data in data base regardless the datahash is on chain or not.
 - request method:POST
 - request: 
same as `postDataWithoutValid`, except __keep `tx_id` empty__ 

```
POST /v2/postDataWithoutVerify HTTP/1.1
Proxy-Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36
DNT: 1
Accept: */*
Origin: http://localhost:8080
Referer: http://localhost:8080/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Content-Type: application/json; charset=utf-8
Host: localhost:8888
Connection: close
Content-Length: 658

{"data_id":"2",
"data":"data_to_send",
"sig":"0xda966d32270ffadf28688f8334e2b056f0ea46d21e1bf48a2d6c800a4ca6278f73f857ce4b9f6a4b54d21c995cf54e335d1b3531c6844ef8d72d18e3cc3ce6f1",
"tx_id":"",
"dataHash":"0x4388db9354d4412f1522c6fbefd129fdd5cf2f48a7e79e07c6b2f80ba9e1f4dc",
"pk":"0x037ba24c6a003b717d3e4a4c0397292acab989ccb64519d71d3088e3817f6126a3",
"cert":"0x3318d7944862c19cf92823fd4247a27de308c518ff1c4248f7e7e0ce7148068e7421601cd606d32bdef7ceb3fe4bf30148e825d8a7443efcb3b0e10822a1d9fb"}
```

 - response: 
 same as `postData`

 ```
 HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Access-Control-Allow-Origin: *
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 01 Dec 2020 08:01:28 GMT
Connection: close

{"code":0,"url":"0xd0e5a389c858406f5125ddeaf14a13e75a59a6acec2655bc225f15bc84b7fe65","state":null,"ticket":null}
 ```

 5. /v2/getData
 - description： Get data via url.
 - request method:POST
 - request: 
 Request consists of 1 field
    - url: string , obtained from `postData`,`postDataWithoutValid` , or computed by `hash(access_token|data_id)`
 - response: 
    Response consists of 3 fields
    - data : string
    - code : number , 0 stands for success
    - proof: null , useless now


### Compile Jar file  

- Install [Java](https://www.java.com/download/) and [maven](https://maven.apache.org/install.html)
- In `file-server` directory, run `mvn package`
- The jar file path is  `target/CKDataBase.jar`

