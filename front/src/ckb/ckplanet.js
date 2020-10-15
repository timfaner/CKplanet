
import  {postData,getData} from "./data_server"

import {sha256,generateECDHKey, encryptData_c,decryptData_c} from "./crypto"


postData,getData



const DATA_ID = {
    user_profile: () => "1",
    user_managed_cycle_list: () => "2",
    user_joined_cycle_list: () => "3",
    cycle_profile:(cycleid) =>{return "4:"+ cycleid},
    cycle_contents:(cycleid) =>{return "5:"+ cycleid},
    cycle_users_list:(cycleid) => {return "6:" + cycleid},
    cycle_tokens_list:(cycleid) => {return "7:" + cycleid}
}

const DATA_ACCESS_TYPE = {
    PUBLIC:'public',
    PRIVATE:'private',
    DEPENDS:'depends'
}

const DATA_ACCESS = {
    user_profile:DATA_ACCESS_TYPE.PUBLIC,
    user_managed_cycle_list:DATA_ACCESS_TYPE.PUBLIC,
    user_joined_cycle_list:DATA_ACCESS_TYPE.PUBLIC,
    cycle_profile:DATA_ACCESS_TYPE.PUBLIC,
    cycle_contents:DATA_ACCESS_TYPE.DEPENDS,
    cycle_users_list:DATA_ACCESS_TYPE.DEPENDS,
    cycle_tokens_list:DATA_ACCESS_TYPE.PUBLIC,
}



const DATA_STRUCT = {
    user_profile:{
        nickname:'',
        avatar_url:''
    },
    user_managed_cycle_list:[
        '0','1'
    ],
    user_joined_cycle_list:[
        {access_token_public:'0x',  //使用access_token_public 检索对应cycle
        data_id:'0'},
    ],
    cycle_profile:{
        cycle_name:'',
        introduction:'',
        avatar_url:'',
        type:'' //enmu, open|close
    },
    cycle_users_list:[
        '0x','0x'
    ],
    cycle_tokens_list:[
        {k:'0x',v:'0x'}
    ]
}

function encryptCycleToken(access_token_public,access_token_private,aes_key,ecdh_pk,ecdh_sk){
    let ecdh_key = generateECDHKey(ecdh_sk,ecdh_pk)
    let k = encryptData_c(access_token_public,ecdh_key)
    let v = encryptData_c(access_token_private + ":" + aes_key,ecdh_key)
    return{
        k,
        v,
    }

}


function decrtptCycleToken(k,v,ecdh_pk,ecdh_sk){
       let ecdh_key = generateECDHKey(ecdh_sk,ecdh_pk)
       let access_token_public = decryptData_c(k,ecdh_key)
       let tmp = decryptData_c(v,ecdh_key)
       let [access_token_private,aes_key] = tmp.split(":")
       return{
           access_token_public,
           access_token_private,
           aes_key
       }
}

/**
 * 
 * @param {string} data_type 
 * @param {object} access_token_items 
 * @param {string=string} cycle_id 
 * @param {number=1} depends  仅在权限为`0`时生效
 */
function getUrl(data_type,access_token_items,cycle_id='',depends='public' ){
    
    if( !(data_type in DATA_ID)){
        throw("Invaild data_type : ",data_type)
    }

    let access_token = ''
    if (DATA_ACCESS[data_type] === 'depends'){
        if(depends === 'public' || depends === 'private')
            access_token = access_token_items['access_token_' + depends]
        else
            throw("Invaild depends type")
    }
    else
        access_token = access_token_items['access_token_' + DATA_ACCESS[data_type] ]
    
    if(access_token === ''){
        throw("empty depends type")
    }
    let url = sha256(access_token + DATA_ID[data_type](cycle_id))
    return url
}

/**
 * 检查输入是否符合格式
 * @param {string} data_type 
 * @param {object} instance 
 * @returns {boolean} boolean
 */
function vaildDataType(data_type,instance){
    var bool = false
    if ( !(data_type in DATA_ID)){
        console.error("Wrong data type : ",data_type)
        bool = false
    }

    if (typeof(instance) !== "object"){
        // array 也是object
        bool =  false
    }

    try {
        let template = DATA_STRUCT[data_type]
        if (  data_type.search("list") !== -1){ 
            // 是list
            if (instance.length === 1){
                bool= true
            }
            instance = instance[0]
            template = template[0]
        }
        if (typeof(template) !==  typeof(instance) ){
            bool =  false
        }
        if (typeof(template) === "string")
            bool =  true

        for(const key in template){
            if(!(key in instance)){
                bool =  false
            }
        }
    } catch (error) {
        console.error(error)
        bool = false
    }

    bool = true
    if(!bool){
        throw("Incorrect data structure data_type : ",data_type)
    }
    return bool
}

export  {DATA_ID,
        DATA_STRUCT,
        DATA_ACCESS,
        getUrl,
        vaildDataType,
        encryptCycleToken,
        decrtptCycleToken
}

