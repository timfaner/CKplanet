import {getData} from "@/ckb/data_server"
import { getCycleTemplate, getUrl,vaildDataType } from "../ckb/ckplanet"
import Vue from 'vue'
import { generateAESKey, sha256 } from "../ckb/crypto"
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
        updateJoinedCyclesIndex(){},
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
        async getManageCycles({state,dispatch,rootState}){
            try {
                let lock_args = rootState.user_chain_info.lock_args
                await dispatch("getManagedCyclesIndex",lock_args)
                let index = state.user_managed_cycles_index
                index.forEach(cycle_id => {
                    dispatch("getCycle",{lock_args,cycle_id})
                });
                
            } catch (error) {
                throw("getManageCycles error",error)
            }
            

        },
        async getUserProfile({commit,getters},lock_args){
            let res = null
            let tmp1 = getters.getSthFromPool(lock_args,"data_server")
            let tmp2 = getters.getSthFromPool(lock_args,"access_token")
            if (tmp1 !== null && tmp2 !== null){
                const server_url = tmp1.ip

                try {
                    const url = getUrl('user_profile',tmp2)
                    res = await getData(server_url,url)
                    if(res === null){
                        return res
                    }
                    if (vaildDataType("user_profile",res)){
                        commit("updateUserInfo",{...res,lock_args,})
                    }
                    
                } catch (error) {
                    console.error("getUserProfile error",error)
                    throw(error)
                }
                
            }
            return res
        },

        async getDataByType({getters},{lock_args,data_type,cycle_id}){
            let res = null
            let tmp1 = getters.getSthFromPool(lock_args,"data_server")
            let tmp2 = getters.getSthFromPool(lock_args,"access_token")
            if (tmp1 !== null && tmp2 !== null){
                const server_url = tmp1.ip
                try {
                    const url = getUrl(data_type,tmp2,cycle_id)
                    res = await getData(server_url,url)
                    if(res === null){
                        return res
                    }
                    if (vaildDataType(data_type,res)){
                        return res
                    }
                    
                } catch (error) {
                    console.error("get Data of "+ data_type + "error",error)
                    throw(error)
                }
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
                    console.error("getUserProfile error",error)
                    throw(error)
                }
                
            }
            return res
        },

        async getCycleAesKey({dispatch,commit,rootState},{lock_args,cycle_id}){

            if(rootState.user_chain_info.lock_args === lock_args){
                //FIXME aes_key生成方法改进
                let aes_key =  generateAESKey(sha256(cycle_id))
                commit("updateCyclesPool",{
                    lock_args,
                    cycle_id,
                    cycle_props:{
                        aes_key
                    }
                })
            }
            else{
                let data_type = "cycle_tokens_list"
                let cycle_tokens_list = await dispatch("getDataByType",{lock_args,data_type,cycle_id})
                //TODO 解析aes_key 
                cycle_tokens_list
            }
        },

        async getCycle({commit,dispatch},{lock_args,cycle_id}){

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
                //获取或生成key
                await dispatch("getCycleAesKey",{lock_args,cycle_id})
                
            } catch (error) {
                console.error("updateCyclesPool error",error)
                throw(error)
            }
                
        },

    },
    getters:{
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