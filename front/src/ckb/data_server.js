import {
        signData,
        sha256
        } from "@/ckb/crypto" 

import {data_server_res,MOCK_API} from "./test"


class DataServer{
  constructor(ip,store){
    this.ip = ip
    this.store = store
  }
  async connect(){
    try {
      
      await this.store.dispatch("getDataServer",this.ip)
      //获取access_token_private,access_token_public

      this.store.dispatch("getPubId")
      this.store.dispatch("getPriId")

    } catch (error) {
      console.error(error)
    }
  }

  async postData(data_id='',data,access_type='public', onchain=false,txid){
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
    if (typeof(data) === Object){
      data = JSON.stringify(data)
      console("data stringfied")
    }
    
    let sig = signData(user_id.sk,data)
    let dataHash = sha256(data)
    
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


const generateDataSig = (sk,data) => {
    return(signData(sk,data))
}


export  {DataServer,getMpk,getAuth,postData,getData,generateDataSig,

}