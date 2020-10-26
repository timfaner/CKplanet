
import { signMessage } from '@/ckb/rpc'



import { DataServer,postData,getData } from "./data_server"

import {
    signData,
    hashFunc
    } from "@/ckb/crypto" 

class DataSetter {
    constructor(data_server){
        this.ip = data_server.ip
        this.store = data_server.store
        this.data_server = data_server
      }

    async updateDataIntegrityOnChain(data_id,data_hash){
        const authToken = window.localStorage.getItem('authToken')

        let address = this.store.state.user_chain_info.address
        let data_hash_sig = await signMessage(data_hash,address,authToken)
        let tx_hash = await this.store.dispatch("updateDataIntegrityOnChain",
        {   
            data_id,
            data_hash,
            data_hash_sig,
        })
        return tx_hash
      }

    async postData(data,data_id='',access_type='public', onchain=false,txid){
        let user_id
        
        if(access_type === "public"){
           user_id = this.store.state.user_id_public
        }
        else if(access_type === "private"){
           user_id = this.store.state.user_id_private
        }
        else{
          throw("Unknown access_type")
        }
    
        if(!onchain){
          txid=''
        }
        if (typeof(data) === "object"){
          data = JSON.stringify(data)
          console.log("data stringfied")
        }
        
        let sig = signData(user_id.sk,data)
        let dataHash = hashFunc(data).slice(2)
        
        let res = await postData(
          this.ip,
          data_id,
          data,
          user_id.access_token,
          sig,
          txid,
          dataHash,
          user_id.pk,
          user_id.cert,
        )
        console.log(res)
        
      }
}

class DataGetter {
    constructor(lock_args,data_server) {
      this.lock_args = lock_args
      this.ip = data_server.ip
      this.data_server = data_server
    }

    static async getDataByUrl(server_ip="",url='',onchain_verify=false,txid){
    
        //TODO 添加链上验证的逻辑
        onchain_verify,txid
    
        if (server_ip === ""){
          server_ip = this.ip
        }
        return await getData(server_ip,url)
    
      }

      static async getDataById(server_ip,data_id='',access_token='',onchain_verify=false,txid){

        let url = hashFunc(access_token + data_id).slice(2)
        return DataServer.getDataByUrl(server_ip,url,onchain_verify,txid)
      }
    
  }



export  {
    DataGetter,DataSetter
}