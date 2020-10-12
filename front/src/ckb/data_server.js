import {
        signData,
        
        } from "@/ckb/crypto" 

import {data_server_res,MOCK_API} from "./test"


class DataServer{

  constructor(store,lock_args){
    this.store = store
    this.lock_args = lock_args
    this.ip = ''
  }


  async getAccessToken(){

    if (this.store.getters.getAccessToken("public") === "" || 
      this.store.getters.getAccessToken("private") === "" ){
      try {
        await this.store.dispatch("getAccessToken")
      } catch (error) {
          console.error(error)
      }
    }
  }

  async updateDataServerInfo(){
    let user_id = this.store.state.user_id_public

    let tx_hash = await this.store.dispatch("updateDataServerInfo",
        {   
            dataserver_ip:this.ip,
            access_token_public:user_id.access_token,
            access_token_public_pk:user_id.pk,
        })
    return tx_hash
  }


  async getDataServer(){

    let res = await this.store.dispatch("getDataServerInfo",this.lock_args)
    return res

  }


  async getDataserverAuth(){

    try {      
      await this.store.dispatch("getDataServerMpk",this.ip)
      //获取access_token_private,access_token_public
      this.store.dispatch("getPubId")
      this.store.dispatch("getPriId")
    } catch (error) {
      console.error(error)
    }
  }

}



const getMpk = async (server_url) =>{
    let payload = {

    }
    if (MOCK_API){
      return  await data_server_res.getMpk()
    }
    const body = JSON.stringify(payload, null, '  ')
    try {
        let res = await fetch(server_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        return res.result.objects
      } catch (error) {
        console.error('error', error)
      }
}




const getAuth = async (server_url,access_token,msg,cpk) =>{

    let payload = {
        access_token,
        msg,
        cpk,
    }
    if (MOCK_API){
      return data_server_res.getAuth(payload)
    }
    const body = JSON.stringify(payload, null, '  ')
    console.log(body)
    try {
        let res = await fetch(server_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        return res.result.objects
      } catch (error) {
        console.error('error', error)
      }
}

//TODO 有或者没有txid
const postData = async (server_url,data_id,data,access_token,sig,txid="",dataHash="",pk,cert) =>{
    let payload = {
        data_id,
        data,
        access_token,
        sig,
        txid,
        dataHash,
        pk,
        cert,
    }
    if (MOCK_API){
      return data_server_res.postData(payload)
    }
    const body = JSON.stringify(payload, null, '  ')
    console.log(body)
    try {
        let res = await fetch(server_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        return res.result.objects
      } catch (error) {
        console.error('error', error)
      }
}


const getData = async (server_url,url) =>{
    let payload = {
        url,
    }

    if (MOCK_API){
      return data_server_res.getData(payload)
    }

    const body = JSON.stringify(payload, null, '  ')
    console.log(body)
    try {
        let res = await fetch(server_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        return res.result.objects
      } catch (error) {
        console.error('error', error)
      }
}


const generateDataSig = (sk,data) => {
    return(signData(sk,data))
}


export  {DataServer,getMpk,getAuth,postData,getData,generateDataSig,

}