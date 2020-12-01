
CKB_NODE_RPC="https://prototype.ckbapp.dev/testnet/rpc"
CKDATABASE_PORT=8877

current_dir=$(shell pwd)

build:
	docker pull mongo:latest
	docker build -t "ckdataserver" . 
	docker network create ckdataserver-net
	docker create  --name ckdatabase_mongos --network ckdataserver-net  mongo 
	docker create --name CKDataBase --network ckdataserver-net -p ${CKDATABASE_PORT}:8877 ckdataserver  ${CKB_NODE_RPC}  --spring.data.mongodb.uri=mongodb://ckdatabase_mongos:27017/local  


start:
	docker start ckdatabase_mongos
	docker start CKDataBase

stop:
	docker stop ckdatabase_mongos
	docker stop CKDataBase