const MOCK_API = true


import {sha256, signData} from './crypto' 
import KVdb  from  "kvdb.io"

let mpk = "0x0349673187530320ad095776b576ac491f6635165ae50e97c686f4c8430359d8bc"
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
        console.log("Mock api called: ", "signMessage", body)
        return {
            result: signData(csk,body.message)
        }
    }
}

const data_server_res = {
    getAuth: (body) => {
        console.log("Mock api called: ", "getAuth", body)
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
// TODO 字符拼接的方法确定
    postData: async (body) => {
        console.log("Mock api called: ", "postData", body)

        let url = sha256(body.access_token + body.data_id)
        await postData(body.data)
        return {
            url:url,
            state:'good',
            ticket:'good',
        }
    },

    getData: async (body) => {
        console.log("Mock api called: ", "getData", body)
        if ('url' in body){
            console.log("url to get data")
            let res= await getData(body.url)
            return res
        }
        else if ("data_id" in body && "access_token" in body){
            console.log("data_id and  access_token to get data")
            let res =  getData( sha256(body.access_token + body.data_id))
            return res

        }
        body.url
        return {
            data:'',
            proof:''
        }
    },
}

const bucket = KVdb.bucket("XEdPUt7zsqFAXgBkCwsBiV")

const  getData = async (url)=>{
    
    let res = await bucket.get(url)
    console.log(res)
    return res
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