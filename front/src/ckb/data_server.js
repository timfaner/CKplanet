import {
        signData,
        
        } from "@/ckb/crypto" 

import {data_server_res,MOCK_API} from "./test"

//TODO 连接数据服务器逻辑(读服务器、写服务器)
class DataServer{

  constructor(store,mode="write"){
    this.store = store
    this.mode = mode
  }

  async postOnChain(){

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


  async getDataServer(){
    await this.store.dispatch("getDataServerMpk",this.ip)
  }

  async getAuth(){

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