import {getData} from "@/ckb/data_server"
import { decryptContent, getCycleTemplate, getUrl,vaildDataType,inJoinedList,inTokenList, getTokenItem, decrtptCycleToken } from "../ckb/ckplanet"
import Vue from 'vue'
import { generateAESKey, hashFunc } from "../ckb/crypto"
const ckplanet = {
    state :() => ({

        wallet_connected:false,
        data_server_connected:false,

        
        user_profiles_pool:{
            
        },
        
        user_joined_cycles_index:[],
        user_managed_cycles_index:[],

        cycles_pool:{},



    }),
    mutations:{
        updateJoinCyclesIndex(state,payload){
            state.user_joined_cycles_index = payload
        },

        updateCycleContents(state,{lock_args,cycle_id,content_id,content,mode}){
            if(lock_args in state.cycles_pool)
                if(cycle_id in state.cycles_pool[lock_args]){

                    if(mode==="create" || mode==="update")
                        Vue.set(state.cycles_pool[lock_args][cycle_id].contents,content_id,content)
                    else if (mode === "delete")
                        Vue.delete(state.cycles_pool[lock_args][cycle_id].contents,content_id)
                    else
                        console.error("[updateCycleContents] Invalid mode",arguments[1])
                    return
                }
            
            console.error("[updateCycleContents] lock_args and cycle_id not in the cycke_pool",arguments[1])
        },

        updateCyclesPool(state,{lock_args,cycle_id,cycle_props}){
            let tmp = getCycleTemplate()
            if(typeof(lock_args)==="undefined" || typeof(cycle_id) === "undefined" || typeof(cycle_props) ==="undefined")
                throw("Lack of args " + lock_args + ' ; ' + cycle_props + ' ; ' + cycle_props)
            for(const key in cycle_props){
                if(!(key in tmp))
                    throw("Invaild cycle_props")
            }
            if(! (lock_args in state.cycles_pool)){
                
                let cycle = getCycleTemplate()
                cycle = {...cycle,...cycle_props}
                Vue.set(
                    state.cycles_pool,
                    lock_args,
                    {[cycle_id]:cycle})
                return}
            if(! (cycle_id in state.cycles_pool[lock_args])){
                let cycle = getCycleTemplate()
                cycle = {...cycle,...cycle_props}

                Vue.set(
                    state.cycles_pool[lock_args],
                    cycle_id,
                    cycle)
                return
            }
            let cycle = state.cycles_pool[lock_args][cycle_id]
            cycle = {...cycle,...cycle_props}
            Vue.set(
                state.cycles_pool[lock_args],
                cycle_id,
                cycle
            )
        },
        updateManagedCyclesIndex(state,payload){
            state.user_managed_cycles_index = payload
        },
        updateUserInfo(state,{lock_args,nickname,avatar_url}){

            let user_profiles = {nickname,avatar_url}
            if (! (lock_args in user_profiles)){
                Vue.set(state.user_profiles_pool,lock_args,user_profiles)
                state.user_profiles_pool[lock_args] = user_profiles
            }
            else{
                let user_profiles_old = state.user_profiles_pool[lock_args]
                for(const key in user_profiles_old){
                    if(  typeof(user_profiles[key]) === "undefined"){
                        user_profiles[key] = user_profiles_old[key]
                }}
                Vue.set(state.user_profiles_pool,lock_args,user_profiles)
                //tate.user_profiles_pool = {...state.user_profiles_pool, user_profiles } 
            }
        },
        walletConnect(state,s=false){
            state.wallet_connected = s
        },
        dataServerConnect(state,s=false){
            state.data_server_connected = s
        }
    },
    actions:{
        //未设置头像、昵称视为不存在
        async checkUserExists({state,dispatch},lock_args){
            if(lock_args in state.user_profiles_pool)
                return true
            try {
                let res = await dispatch("getUserProfile",lock_args)
                if(res!==null)
                    return true
                 return false
            } catch (error) {
                console.error(error)
                return false
            }
            
        },
        async getContentsList({state,commit,dispatch},{lock_args,cycle_id}){
            let data_type  = "cycle_contents_list"
            if(lock_args in state.cycles_pool)
                if(cycle_id in state.cycles_pool[lock_args]){
                    let cycle = state.cycles_pool[lock_args][cycle_id]

                    let access_type=''
                    if(cycle.cycle_profile.type==="open")
                        access_type="public"
                    else if (cycle.cycle_profile.type==="close")
                        access_type="private"

                    try {
                        let contents_list = await dispatch("getDataByType",{lock_args,data_type,cycle_id,access_type})

                        vaildDataType(data_type,contents_list)
    
                        commit("updateCyclesPool",{lock_args,cycle_id,cycle_props:{
                            contents_list,
                        }})
                    } catch (error) {
                        console.error("getContentsList failed",lock_args,cycle_id)
                        throw(error)
                    }
                }
            else
                console.warn("Cycle not found. lock_args: "+lock_args + " cycle_id: "+ cycle_id)
        },
        async getContent({state,commit,dispatch},{lock_args,cycle_id,content_id}){

            let data_type  = "cycle_content"
            if(lock_args in state.cycles_pool)
                if(cycle_id in state.cycles_pool[lock_args]){
                    let cycle = state.cycles_pool[lock_args][cycle_id]

                    let access_type=''
                    if(cycle.cycle_profile.type==="open")
                        access_type="public"
                    else if (cycle.cycle_profile.type==="close")
                        access_type="private"

                    let aes_key = cycle.aes_key
                    try {
                        let content_encypted = await dispatch("getDataByType",{lock_args,data_type,cycle_id,content_id,access_type})
                        let content = decryptContent(content_encypted,aes_key)
                        vaildDataType(data_type,content)
    
                        commit("updateCycleContents",{
                            lock_args,
                            cycle_id,
                            content_id,
                            content,
                            mode:"update"

                        })
                    } catch (error) {
                        console.error("getContents failed",lock_args,cycle_id,content_id)
                        throw(error)
                    }
                }
                
            else
                console.warn("Cycle not found. lock_args: "+lock_args + " cycle_id: "+ cycle_id)

            
            

        },
        async getCycleContents({dispatch,state},{lock_args,cycle_id}){
            try {
                await dispatch("getContentsList",{lock_args,cycle_id})
                let contents_list = state.cycles_pool[lock_args][cycle_id].contents_list
                contents_list.forEach(function(content_id){
                    dispatch("getContent",{lock_args,cycle_id,content_id})
                })
            } catch (error) {
                console.warn("getCyclesContents failed")
                throw(error)
            }
        
        },
        async getManageCycles({state,dispatch},lock_args){
            try {
                await dispatch("getManagedCyclesIndex",lock_args)
                let index = state.user_managed_cycles_index
                index.forEach(cycle_id => {
                    dispatch("getCycle",{lock_args,cycle_id})
                    .catch((e)=> console.error("Getting cycles in [getManageCycles]",e))
                });
                
            } catch (error) {
                throw("getManageCycles error",error)
            }
        },

        async getJoinCycles({state,dispatch},lock_args){
            try {
                await dispatch("getJoinCyclesIndex",lock_args)
                let index = state.user_joined_cycles_index
                index.forEach(function(item){
                    let lock_args=item.lock_args
                    let cycle_id=item.cycle_id
                    dispatch("getCycle",{lock_args,cycle_id})
                    .catch((e)=> console.error("[getJoinCycles] etting cycles in error",e))
                })
            } catch (error) {
                throw("getJoinCycles error",error)
            }
        },

        async getJoinCyclesIndex({dispatch,commit},lock_args){
            try {
                let data_type = "user_joined_cycle_list"
                let user_joined_cycle_list = await dispatch("getDataByType",{lock_args,data_type})
                commit("updateJoinCyclesIndex",user_joined_cycle_list)
            } catch (error) {
                throw("getJoinCyclesIndex error",error)
            }
        },
        
        async getUserProfile({commit,dispatch},lock_args){
            let res = null
            try {

                let data_type = "user_profile"
                res = await dispatch("getDataByType",{lock_args,data_type})
                if(res !== null)
                    commit("updateUserInfo",{...res,lock_args,})
                
            } catch (error) {
                console.error("getUserProfile error",error)
                throw(error)
            }
            return res
        },

        async getDataByType({getters,dispatch},{lock_args,data_type,cycle_id,content_id,access_type}){
            console.debug("[getDataByType] Trying to get <" + data_type + "> with arguments : " , arguments[1])
            let res = null
            let tmp1 = getters.getSthFromPool(lock_args,"data_server")
            let tmp2 = getters.getSthFromPool(lock_args,"access_token")
            if (tmp1 === undefined || tmp2 === undefined ){
                try {
                    res = await dispatch("getDataServerInfo",lock_args)
                    tmp1 = getters.getSthFromPool(lock_args,"data_server")
                    tmp2 = getters.getSthFromPool(lock_args,"access_token")
                } catch (error) {
                    console.warn("DataServer info of "+ lock_args +" not found")
                    throw(("DataServer info of "+ lock_args +" not found"))
                }
                 
            }
                
 
                try {
                    const server_url = tmp1.ip
                    if(typeof(access_type)===undefined)
                        access_type="public" 
                    const url = getUrl(data_type,tmp2,cycle_id,content_id,access_type)
                    res = await getData(server_url,url)
                    console.debug("[getDataByType] Got <" + data_type + "> with arguments : " , arguments[1] ,res)
                    if(res === null){
                        return res
                    }
                    if (vaildDataType(data_type,res)){
                        return res
                    }
                    
                } catch (error) {
                    console.error("[getDataByType] Error to get <" + data_type + "> with arguments : " ,arguments[1],error)
                    throw(error)
                }
        
    },

        async getManagedCyclesIndex({commit,getters},lock_args){
            let res = null
            let tmp1 = getters.getSthFromPool(lock_args,"data_server")
            let tmp2 = getters.getSthFromPool(lock_args,"access_token")
            if (tmp1 !== null && tmp2 !== null){
                const server_url = tmp1.ip

                try {
                    let data_type = 'user_managed_cycle_list'
                    const url = getUrl(data_type,tmp2)
                    res = await getData(server_url,url)
                    if(res === null){
                        return res
                    }
                    if (vaildDataType(data_type,res)){
                        commit("updateManagedCyclesIndex",res)
                    }
                    
                } catch (error) {
                    console.error("getManagedCyclesIndex ",error)
                    throw(error)
                }
                
            }
            return res
        },

        generateCycleAesKey({state},{lock_args,cycle_id}){
            //FIXME cycle key 生成方法
            state
            return generateAESKey(hashFunc(lock_args+cycle_id))
        },

        async getCycle({commit,dispatch,rootState,getters},{lock_args,cycle_id}){

            try {
                let data_type = 'cycle_profile'

                let cycle_profile = await dispatch("getDataByType",{lock_args,data_type,cycle_id})
                if(cycle_profile === null)
                    return cycle_profile

                commit("updateCyclesPool",{
                    lock_args,
                    cycle_id,
                    cycle_props:{
                        cycle_profile
                    }
                })

                data_type = 'cycle_tokens_list'
                let token_list = await dispatch("getDataByType",{lock_args,data_type,cycle_id})
                console.debug("[getCycle] Got <" + data_type + "> of",arguments[1],token_list)


                commit("updateCyclesPool",{
                    lock_args,
                    cycle_id,
                    cycle_props:{
                        token_list:token_list
                    }
                })

            
                //获取或生成key
                if(getters.cycle_joined_status(lock_args,cycle_id)==='joined' || lock_args===rootState.user_chain_info.lock_args){
                    
                    let aes_key = ''
                    let access_token_private = ''
                    if(lock_args===rootState.user_chain_info.lock_args)
                        aes_key = await dispatch("generateCycleAesKey",{lock_args,cycle_id})
                    else{
                        let tmp = getters.getSthFromPool(lock_args,"access_token")
                        let pk = tmp.access_token_public_pk
                        let sk = rootState.user_id_public.sk
                        let token_item = getTokenItem(lock_args,token_list,pk,sk)
                        let res =  decrtptCycleToken(token_item,pk,sk)

                        console.debug("[getCycle] Got <" + "decrypt items" + "> of",arguments[1],res)

                        access_token_private = res.access_token_private
                        aes_key = res.aes_key
                        // 更新对应access_token_private
                        commit("updateAccessTokens",{
                            lock_args,
                            access_token_private
                        })
                        }

                    commit("updateCyclesPool",{
                        lock_args,
                        cycle_id,
                        cycle_props:{
                            aes_key,
                        }
                    })
                }

                if(  cycle_profile.type==='open' ||   //公开的
                     getters.cycle_joined_status(lock_args,cycle_id)==='joined' ||  //已经加入的
                     lock_args===rootState.user_chain_info.lock_args) { //自己创建的
                    data_type = 'cycle_users_list'
                    let access_type = ''
                    if(cycle_profile.type==='open'){
                         access_type = "public"
                    }
                    else if (cycle_profile.type ==="close"){
                         access_type = "private"
                    }
                    
                    let user_lists = await dispatch("getDataByType",{lock_args,data_type,cycle_id,access_type})
                    commit("updateCyclesPool",{
                        lock_args,
                        cycle_id,
                        cycle_props:{
                            user_lists,
                        }
                    })
                    //获取圈子信息
                    dispatch("getCycleContents",{lock_args,cycle_id})
                }

                
                
            } catch (error) {
                console.error("getCycle base info error",error)
                throw(error)
            }
                
        },

    },
    getters:{
        cycle_joined_status : (state,getters,rootState) => (lock_args,cycle_id) =>{
            try{
            let token_list = state.cycles_pool[lock_args][cycle_id]['token_list']
            let type = state.cycles_pool[lock_args][cycle_id]['cycle_profile']['type']
            let inlocal = inJoinedList(lock_args,cycle_id,state.user_joined_cycles_index)
            let tmp = getters.getSthFromPool(lock_args,"access_token")
            let pk = tmp.access_token_public_pk
            let sk = rootState.user_id_public.sk

            let inRemote = inTokenList(lock_args,token_list,pk,sk)

            let joined_status = 'disjointed'
            if(!inlocal)
                joined_status = 'disjointed'
            else if(inlocal && !inRemote){
                if(type === "open")
                    joined_status = 'joined'
                else if(type ==="close")
                    joined_status = 'pending'}
            else if (inlocal && inRemote)
                joined_status = 'joined'
            else
                throw("Unknow joined_status judge")
            return joined_status}
            catch(error){
                console.warn("can't got cycle joined status \n"+ lock_args + '|' + cycle_id + '\n',error)
                return 'disjointed'
            }
        },
        userProfile: (state) =>
          (lock_args) =>{
              if(lock_args in state.user_profiles_pool){
                  return state.user_profiles_pool[lock_args]
              }
              return null
          }
      
    },

}


export default  ckplanet