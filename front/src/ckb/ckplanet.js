import  {postData,getData} from "./data_server.js"

import {hashFunc,generateECDHKey, encryptData_c,decryptData_c} from "./crypto.js"


postData,getData



const DATA_ID = {
    user_profile: () => "1",
    user_managed_cycle_list: () => "2",
    user_joined_cycle_list: () => "3",
    cycle_profile:(cycleid) =>{return "4:"+ cycleid},
    cycle_contents_list:(cycleid) =>{return "5:"+ cycleid},
    cycle_content:(cycleid,contendid) => {return "50:" + cycleid+ ':' + contendid},
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
    cycle_contents_list:DATA_ACCESS_TYPE.DEPENDS,
    cycle_content:DATA_ACCESS_TYPE.DEPENDS,
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
        {lock_args:'0x',  //使用lock_args 检索对应cycle
        cycle_id:'0'},
    ],
    cycle_contents_list:[
        '0','1'
    ],
    cycle_content:{
        title:'',
        content:'',
        time:''
    },
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


const CYCLE = {
    cycle_profile:{
        cycle_name:'',
        introduction:'',
        avatar_url:'',
        type:'' //enmu, open|close
    },
    joined_status:'disjointed', //enmu , joined|pending|disjointed
    aes_key:'',
    user_lists:[],
    contents_list:[],
    token_list:[],
    contents:{
    }    
}

function getTokenItem(lock_args,token_list,ecdh_pk,ecdh_sk){
    let ecdh_key = generateECDHKey(ecdh_sk,ecdh_pk)
    let k = encryptData_c(lock_args,ecdh_key).encrypted_data
    for(const item of token_list){
        console.log(k)
        console.log(item.k)
        if(item.k===k)
            return item
    }
    return null
}
function inTokenList(lock_args,token_list,ecdh_pk,ecdh_sk){
    let ecdh_key = generateECDHKey(ecdh_sk,ecdh_pk)
    let k = encryptData_c(lock_args,ecdh_key).encrypted_data
    for(const item of token_list){
        console.log(k)
        console.log(item.k)
        if(item.k===k)
            return true
    }
    return false
}

function inJoinedList(lock_args,cycle_id,joined_cycle_list){
    for(const item of joined_cycle_list){
        if(cycle_id === item.cycle_id && lock_args === item.lock_args)
            return true
    }
    return false
}
function encryptContent(content,aes_key){
    content,aes_key
    //TODO 
    return content
}

function decryptContent(content,aes_key){
    // TODO
    content,aes_key
    return content
}
function getCycleTemplate(){
    return JSON.parse(JSON.stringify(CYCLE))
}
function getDataTemplate(data_type){
    
    let raw = DATA_STRUCT[data_type]
    let tmp = JSON.stringify(raw)
    return JSON.parse(tmp)
    
}

/**
 * 
 * @param {object} param0 primative token,consists of {lock_args,access_token_private,aes_key}
 * @param {string} ecdh_pk public key of   access_token_public  owned by lock_args
 * @param {string} ecdh_sk private key of the  users, which is associtaed with access_token_private
 */
function encryptCycleToken({lock_args,access_token_private,aes_key},ecdh_pk,ecdh_sk){
    let ecdh_key = generateECDHKey(ecdh_sk,ecdh_pk)
    let tmp1 = encryptData_c(lock_args,ecdh_key)
    let tmp2 = encryptData_c(access_token_private + ":" + aes_key,ecdh_key)
    return{
        k:tmp1.encrypted_data,
        v:tmp2.encrypted_data
    }

}

/**
 * 
 * @param {object} param0 cycle_token item, `{k,v}`
 * @param {*} ecdh_pk public key of   access_token_public  owned by lock_args
 * @param {*} ecdh_sk  private key of the  users, which is associtaed with access_token_private
 */
function decrtptCycleToken({k,v},ecdh_pk,ecdh_sk){
       let ecdh_key = generateECDHKey(ecdh_sk,ecdh_pk)
       let lock_args = decryptData_c(k,ecdh_key)
       let tmp = decryptData_c(v,ecdh_key)
       let [access_token_private,aes_key] = tmp.split(":")
       return{
            lock_args,
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
function getUrl(data_type,access_token_items,cycle_id='',content_id='',depends='public' ){
    
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
        throw(" access_token not found : " +arguments ,access_token_items)
    }
    let url = hashFunc(access_token + DATA_ID[data_type](cycle_id,content_id))
    return url
}

/**
 * 检查输入是否符合格式
 * @param {string} data_type 
 * @param {object} instance 
 * @returns {boolean} boolean
 */
function vaildDataType(data_type,thing_to_check){

    let instance = JSON.parse(JSON.stringify(thing_to_check))
    var bool = false
    if ( !(data_type in DATA_ID)){
        console.error("Wrong data type : ",data_type)
        return   false
    }

    if (typeof(instance) !== "object"){
        // array 也是object
        return false
    }

    try {
        let template = JSON.parse(JSON.stringify(DATA_STRUCT[data_type]))
        if (  data_type.search("list") !== -1){ 
            // 是list
            if (instance.length === 0){
                return true
            }
            instance = instance[0]
            template = template[0]
        }
        if (typeof(template) !==  typeof(instance) ){
            return  false
        }
        if (typeof(template) === "string")
            return  true

        for(const key in template){
            if(!(key in instance)){
                 return  false
            }
        }
    } catch (error) {
        console.error(error)
        return false
    }

    bool = true
    return bool
}

/**
 * 
 * @param {string} data_type 
 * @param {*} data 
 * @returns data对应的hash
 */
function getDataHash(data_type,data){
    data_type
    let jsons = JSON.stringify(data)
    let hash= hashFunc(jsons)
    return hash
}


function getDataID(data_type,cycle_id,content_id){
    return DATA_ID[data_type](cycle_id,content_id)
}

export  {DATA_ID,
        DATA_STRUCT,
        DATA_ACCESS,
        getUrl,
        vaildDataType,
        encryptCycleToken,
        decrtptCycleToken,
        getDataHash,
        getDataTemplate,
        getDataID,
        getCycleTemplate,
        encryptContent,

        decryptContent,
        inTokenList,
        inJoinedList,
        getTokenItem,

}

