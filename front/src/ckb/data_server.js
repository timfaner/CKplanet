import {
        signData,
        
        } from "@/ckb/crypto" 

import {data_server_res,MOCK_API} from "./test"


class DataServer{

  constructor(store,lock_args){
    this.store = store
    this.lock_args = lock_args
    try {
      this.ip = store.state.data_server_pool[lock_args].ip
    } catch (error) {
      this.ip = ''
      console.warn("Inital data_server empty, lock_args: ",lock_args)
    }
    
  }

  setIp(ip){
    this.ip = ip
    this.store.commit("updateDataServer",{
      lock_args:this.lock_args,
      ip,
    })
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

    try {
      let tx_hash = await this.store.dispatch("updateDataServerInfoOnChain",
      {   
          dataserver_ip:this.ip,
          access_token_public:user_id.access_token,
          access_token_public_pk:user_id.pk,
      })
      return tx_hash
    } catch (error) {
      console.error("update data server info failed ;user_id = ",user_id)
      throw(error)
    }

  }


  async getDataServer(){

    let res = await this.store.dispatch("getDataServerInfo",this.lock_args)
    return res

  }


  async getDataserverAuth(){

    try {      
      await this.store.dispatch("getDataServerMpk",this.lock_args)
      //获取access_token_private,access_token_public
      await this.store.dispatch("getPubId")
      await this.store.dispatch("getPriId")
    } catch (error) {
      console.error(error)
      throw("get DataServer auth failed",this.ip,error)
    }
  }

}



const getMpk = async (server_url) =>{
    let payload = {

    }
    if (MOCK_API.GET_MPK){
      let res = await data_server_res.getMpk()
      return res.mpk
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
        return res.mpk
      } catch (error) {
        console.error('error', error)
      }
}




const getAuth = async (server_url,access_token,msg,cpk) =>{

    let payload = {
        access_token,
        msg:"Nervos Message:" + msg,
        cpk,
    }
    if (MOCK_API.GET_AUTH){
      return data_server_res.getAuth(payload)
    }
    const body = JSON.stringify(payload, null, '  ')
    console.log(body)
    try {
        let res = await fetch(server_url +"/v2/getAuth" , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        if(res.code!==0)
          throw(console.error("getAuth error, "+ res.code))
        return res
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
        tx_id:txid,
        dataHash:dataHash,
        pk,
        cert,
    }
    if (MOCK_API.POST_DATA){
      return data_server_res.postData(payload)
    }
    const body = JSON.stringify(payload, null, '  ')
    console.log(body)
    try {
        let res = await fetch(server_url + "/v2/postData", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        if(res.code!==0)
          throw(console.error("postData error, "+ res.code))
        return res
      } catch (error) {
        console.error('error', error)
      }
}


const getData = async (server_url,url) =>{
    let payload = {
        url,
    }

    if (MOCK_API.GET_DATA){
      return data_server_res.getData(payload)
    }

    const body = JSON.stringify(payload, null, '  ')
    console.log(body)
    try {
      //TODO 如果对应url未找到，返回null
        let res = await fetch(server_url+'/v2/getData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        })
        res = await res.json()
        if(res.code!==0)
          throw(console.error("getData error, "+ res.code))

        return JSON.parse(res.data)
      } catch (error) {
        console.error('error', error)
      }
}


const vaild = async (server_url,url) =>{
  let payload = {
      url,
  }

  if (MOCK_API.GET_DATA){
    return data_server_res.getData(payload)
  }

  const body = JSON.stringify(payload, null, '  ')
  console.log(body)
  try {
    //TODO 如果对应url未找到，返回null
      let res = await fetch(server_url+'/v2/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
      res = await res.json()
      if(res.code!==0)
        throw(console.error("getData error, "+ res.code))

      return res.data
    } catch (error) {
      console.error('error', error)
    }
}

const generateDataSig = (sk,data) => {
    return(signData(sk,data))
}


export  {DataServer,getMpk,getAuth,postData,getData,generateDataSig,vaild

}