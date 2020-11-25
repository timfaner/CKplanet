const MOCK_API = 
{
    SIGN_MESSAGE : true,
    GET_MPK: true,
    GET_AUTH : true,
    POST_DATA : true,
    GET_DATA : true,
}
false
const KVDB_ENABLE = true


import {hashFunc, signData} from './crypto' 
import KVdb  from  "kvdb.io"
import {TYPE,NETWORK_CONST} from "@/config"


let mpk = "0x03d645d07206207cd8327e0aef11e2cfbfce2e267b1df0fffc4df681ce46d72d2c"
let msk = "0x471de43eaacd810ff93ca666f5d2146536b412db3895bca2dde7d20f921655b4"

let sk = "0x0cfd9abaca8819d6fb88ba74031438f9eda7aef15411efbdd4c2f293bf439e6b"
let pk = "0x028e3b936cddc073e7839b3ffd043045f6721a0b9551e5d66f2f5551bcc3149ef8"

//let ip = "127.0.0.1:1234"
let csk = "0x714faa3807cc7212e6b3bb19216ae31c825bf83b6bcea96221a1e5e0127c99d9"
//let cpk = "0x035f0d2e984abc5633654c64ca16e551675ad8fc9758c61d639590752dd2327e0a"


//let access_token_public = signData(csk,"public")
//0x0354abd4f62e5e1ed2abdbc71cbb55fb0132e12ffbc25882733a79ca578a96b85bc51d43e03fed161db8ac6b23c3e03e7cbf0a43e98a316311f83f89eff2959f
//let access_token_private = signData(csk,"private")
//0xeb09ff23121575f3cd27a397923e7a7bad37b7fc7b394ab0417b3f06b82c9dd60c0aff13088931c385b965d8f1c86777fbc2ccb96fdbace6039396294d4e4767

//let data_list = []



const keypering_res = {
    
    signMessage: (body) => {
        let csk_m = hashFunc(window.app.$store.state.user_chain_info.address)
        console.debug("Mock api called: ", "signMessage", body,csk_m)
        csk
        return {
            
            result: signData(csk_m,body.message)
        }
    }
}

const data_server_res = {
    getAuth: (body) => {
        console.debug("Mock api called: ", "getAuth", body)
    return {
        cert:  signData(msk,pk + body.access_token),
        pk,
        sk,
    }
    },
    getMpk: async () => { 
    return {
        mpk,
    }
    },

    postData: async (body) => {
        console.debug("Mock api called: ", "postData", body)

        let url = hashFunc(body.access_token + body.data_id)
        if(KVDB_ENABLE)
            await postData(url,body.data)
        return {
            url:url,
            state:'good',
            ticket:'good',
        }
    },

    getData: async (body) => {
        console.debug("Mock api called: ", "getData", body)
        if ('url' in body){
            console.debug("url to get data")
            if(KVDB_ENABLE){
                let res= await getData(body.url)
                return res}
        }
        else if ("data_id" in body && "access_token" in body){
            console.debug("data_id and  access_token to get data")
            if(KVDB_ENABLE){
            let res =  getData( hashFunc(body.access_token + body.data_id).splice(2))
            return res}
        }
        body.url
        return {
            data:'',
            proof:''
        }
    },
}

const bucket = KVdb.bucket(NETWORK_CONST[TYPE].kvdb_bucket)

const  getData = async (url)=>{
    try {
        let res = await bucket.get(url)
        console.debug("get data from kvdb",res)
        return JSON.parse(res)
    } catch (error) {
        if(error.message === '404 - Not Found'){
            console.warn(error)
            return null}
        else
            throw(error)
    }

}

const  postData = async (url,data) =>{
    if( typeof(data) === "object"){
        data = JSON.stringify(data)
    }
    await  bucket.set(url,data)
}


export   {MOCK_API,
    data_server_res,
    keypering_res,getData,postData}