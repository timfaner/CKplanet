import Vue from 'vue'
import Vuex from 'vuex'
import { getSummary,groupCells } from '@/ckb/utils'
import { getCellsByLocks, queryAddresses,signMessage } from '@/ckb/rpc'

import ckplanet from './ckplanet' 

import {getMpk,getAuth} from '@/ckb/data_server'

import {changeOnChain} from "@/ckb/transaction"

import {DATASERVER_INFO,DATA_INTEGRITY,DAPP_ID,CELLS_CACHE_TIME } from '@/ckb/const'
import { textToHex,hexToText,filterCellsWithTypeScript } from '../ckb/utils'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_ds:null,
    user_chain_info:{
      
      address:'',
      lock_script:null,
      lock_args:'',
      lock_hash:'',
      public_key:'',
      balance_summary:{
        inuse: 0,
        free: 0,
        capacity: 0,
      }
    },


    user_id_public:{
      access_token:'',
      pk:'',
      sk:'',
      cert:'',
    },
    user_id_private:{
      access_token:'',
      pk:'',
      sk:'',
      cert:'',
    },
    cells_pool:{

    },
    access_token_pool:{

    },
    data_server_pool:{

    }
  },
  getters:{
    getAccessToken: (state) => (lock_args,type)=>{
      if (type === "public" || type === "private"){
        return state.access_token_pool[lock_args]["access_token_"+ type]
      }
      else {
        return ""
      }
    },

    getSthFromPool: (state) => (lock_args,type) =>{

      if( ["access_token","cells","data_server"].includes(type)){

        try {
          let sth = state[type + "_pool"][lock_args]
          return sth
        } catch (error) {
          console.warn(error)
          return null
        }
      }
      else{
        console.warn("Unknown pool type",type)
        return null
      }
    }
  },
  mutations: {

    updateUserDS(state,user_ds){
      state.user_ds = user_ds
    },
    updateUser(state,user_chain_info){
      state.user_chain_info = user_chain_info
    },

    
    updateAccessTokens(state,
      {lock_args,
      access_token_public,
      access_token_public_pk,
      access_token_private,
      access_token_private_pk}){

      let access_tokens = {access_token_public,access_token_public_pk,access_token_private,access_token_private_pk}
      if ( ! (lock_args in state.access_token_pool)){
          state.access_token_pool[lock_args] = access_tokens
        }
      else{
        const key = lock_args

        let access_tokens_old = state.access_token_pool[lock_args]

        for (const key in access_tokens_old){
          if(  typeof(access_tokens[key]) === "undefined"){
            access_tokens[key] = access_tokens_old[key]
          }
        }
        state.access_token_pool = {...state.access_token_pool,[key]:access_tokens}
      }
    },


    updateUserCells(state,{lock_args,cells}){

      const { emptyCells, filledCells } = groupCells(cells)
      
      let user_cells = {}
      user_cells.empty_cells = emptyCells
      user_cells.filled_cells = filledCells
      user_cells.update_time = new Date().getTime()

      if ( !(lock_args in state.cells_pool)){
        state.cells_pool[lock_args] = user_cells
      }
      else{
        const key = lock_args
        state.cells_pool = {...state.cells_pool,[key]:user_cells}
      }


      if(cells && cells.length > 0){
        state.user_chain_info.balance_summary = getSummary(cells)}
    },

    updateDataServer(state,{lock_args,ip,mpk}){


      let data_servers = {ip,mpk}
      if ( ! (lock_args in state.data_server_pool)){
          state.data_server_pool[lock_args] = data_servers
        }
      else{
        const key = lock_args

        let data_servers_old = state.data_server_pool[lock_args]

        for (const key in data_servers_old){
          if(  typeof(data_servers[key]) === "undefined"){
            data_servers[key] = data_servers_old[key]
          }
        }
        state.data_server_pool = {...state.data_server_pool,[key]:data_servers}
      }

    },
    updatePublicId(state,payload){
      if ('access_token' in payload){
        state.user_id_public.access_token = payload.access_token
      }
      else if ('pk' in payload && 'sk' in payload && 'cert' in payload ){
        state.user_id_public.pk = payload.pk
        state.user_id_public.sk = payload.sk
        state.user_id_public.cert = payload.cert
      }
    },

    updatePrivateId(state,payload){
      if ('access_token' in payload){
        state.user_id_private.access_token = payload.access_token
      }
      else if ('pk' in payload && 'sk' in payload && 'cert' in payload ){
        state.user_id_private.pk = payload.pk
        state.user_id_private.sk = payload.sk
        state.user_id_private.cert = payload.cert
      }
    },


  },
  actions: {
    //从ckb-indexer 获取 lock_args 对应的cells并放入缓存池
    async getUserCells({commit,state},lock_args){

      if(lock_args in state.cells_pool){
        let last_update_time = state.cells_pool[lock_args].update_time
        let now_time = new Date().getTime()

        if(now_time - last_update_time <= CELLS_CACHE_TIME){
          console.log("cells pool using cache")
          return 
        }
          
      }

      const cells = await getCellsByLocks(lock_args)
      commit("updateUserCells",
      { lock_args,
        cells})
    },

    async getUser({dispatch,commit,state}){
      const authToken = window.localStorage.getItem('authToken')

      if (!authToken) {
        console.error('No auth token')
        throw('No auth token')
      }
      const addresses = (await queryAddresses(authToken)).addresses
      if (addresses && addresses.length > 0) {
      commit("updateUser",
      {
        address:addresses[0].address,
        lock_args:addresses[0].lockScript.args,
        lock_script:addresses[0].lockScript,
        public_key:addresses[0].publicKey,
        lock_hash:addresses[0].lockHash,
        balance_summary:{
          inuse: 0,
          free: 0,
          capacity: 0,
        }
      })}
      dispatch('getUserCells',state.user_chain_info.lock_args)
    },
        

    async getAccessToken({commit,state}){

      const authToken = window.localStorage.getItem('authToken')

      let access_token = await signMessage("public","Get public token",authToken)
      commit("updatePublicId",{access_token})
      commit("updateAccessTokens",{
        lock_args: state.user_chain_info.lock_args,
        access_token_public:access_token
      })

      access_token = await signMessage("private","Get access_token_private ",authToken)
      commit("updatePrivateId",{access_token}) 
      commit("updateAccessTokens",{
        lock_args:state.user_chain_info.lock_args,
        access_token_private:access_token
      })
    },

    async getDataServerMpk({state,commit},lock_args){
      let ip = state.data_server_pool[lock_args].ip
      
      let mpk = await getMpk(ip)
      console.log("Got mpk",mpk)
      commit("updateDataServer",
      {lock_args,mpk})
    },

    //从链上获取 lock_args 对应的 服务器信息
    async getDataServerInfo({commit,state,dispatch},lock_args){
      
      await dispatch("getUserCells",lock_args)
      let filled_cells = state.cells_pool[lock_args].filled_cells

      let type_script = DATASERVER_INFO.script
      type_script.args = textToHex(DAPP_ID)

      let cells = filterCellsWithTypeScript(filled_cells,type_script)
      
      if(cells.length === 1){
          let tmp = hexToText(cells[0].output_data)
          let res = JSON.parse(tmp)
          //TODO 检查返回的参数是否符合规则
          commit("updateAccessTokens",{
            lock_args,
            access_token_public:res.access_token,
            access_token_public_pk:res.access_token_pk
          })
          commit("updateDataServer",
          {lock_args,ip:res.dataserver_ip})
          dispatch("getDataServerMpk",lock_args)
          return res
        }
      else if (cells.length === 0){
        console.info("DataServer info not found. lock_args = ",lock_args)
        return null
      }
      else{
        console.error("getDataServerInfo more than one cells located",cells)
        throw("getDataServerInfo Wrong: more than one cells located", cells)
      }
      

    },

    async getDataIntegrity({state,dispatch},{lock_args,data_id}){

      await dispatch("getUserCells",lock_args)
      let filled_cells = state.cells_pool[lock_args].filled_cells

      let type_script = DATA_INTEGRITY.script
      type_script.args = textToHex(data_id)

      let cells = filterCellsWithTypeScript(filled_cells,type_script)

      if(cells.length === 1){
        let tmp = hexToText(cells[0].output_data)

        //TODO 检查返回的参数是否符合规则
        return JSON.parse(tmp)
      }
      else if (cells.length === 0){
        return null
      }
      else{
        console.error("getDataIntegrity More then one cell",cells)
        throw("getDataIntegrity More then one cell", cells)
      }
    },


    async getPubId({commit,state,getters}){
    
      console.log("getting Pub ID")
      const lock_args = state.user_chain_info.lock_args
      let sth = getters.getSthFromPool(lock_args,"data_server")
      const ip = sth.ip
      // TODO 测试api
      let res = await getAuth(
        ip,
        state.user_id_public.access_token,
        "public",
        state.user_chain_info.public_key
        )
        commit("updatePublicId",res)
        commit("updateAccessTokens",{
          lock_args:state.user_chain_info.lock_args,
          access_token_public_pk:res.pk
        })
    },
    async getPriId({commit,state,getters}){
      console.log("getting Pri ID")
      const lock_args = state.user_chain_info.lock_args
      let sth = getters.getSthFromPool(lock_args,"data_server")
      const ip = sth.ip
      let res = await getAuth(
        ip,
        state.user_id_private.access_token,
        "private",
        state.user_chain_info.public_key
        )
        commit("updatePrivateId",res)
        commit("updateAccessTokens",{
          lock_args:state.user_chain_info.lock_args,
          access_token_private_pk:res.pk
        })
    },

    



    async createDataServerInfoOnChain({dispatch,state},DataServerInfo){
      // 更新本用户的cell池
      await dispatch('getUserCells',state.user_chain_info.lock_args)
      let dappID = textToHex(DAPP_ID)

      let data = JSON.stringify(DataServerInfo)
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.cells_pool[state.user_chain_info.lock_args].empty_cells,
        null,
        DATASERVER_INFO,
        'create',
        state.user_chain_info.lock_args,
        dappID,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
      return tx_hash
    },

    async updateDataServerInfoOnChain({commit,dispatch,state},DataServerInfo){
      // 更新本用户的cell池

      try {
        await dispatch('getUserCells',state.user_chain_info.lock_args)
        let dappID = textToHex(DAPP_ID)

        let data = JSON.stringify(DataServerInfo)
        data = textToHex(data)

        let tx_hash = await changeOnChain(
          state.cells_pool[state.user_chain_info.lock_args].empty_cells,
          state.cells_pool[state.user_chain_info.lock_args].filled_cells,
          DATASERVER_INFO,
          'update',
          state.user_chain_info.lock_args,
          dappID,
          state.user_chain_info.lock_hash,
          data
        )

        let ip = DataServerInfo.dataserver_ip
        commit("updateDataServer",{
          lock_args:state.user_chain_info.lock_args,
          ip,
        })
  
        console.debug(tx_hash)
        return tx_hash
      } catch (error) {
        console.error( "updateDataserver error")
        throw(error)
      }

    },

    async deleteDataServerInfoOnChain({dispatch,state}){

      try {
        // 更新本用户的cell池
        await dispatch('getUserCells',state.user_chain_info.lock_args)
        let dappID = textToHex(DAPP_ID)

        let tx_hash = await changeOnChain(
          state.cells_pool[state.user_chain_info.lock_args].empty_cells,
          state.cells_pool[state.user_chain_info.lock_args].filled_cells,
          DATASERVER_INFO,
          'delete',
          state.user_chain_info.lock_args,
          dappID,
          state.user_chain_info.lock_hash,
          ''
        )

        console.debug(tx_hash)
        return tx_hash
      } catch (error) {
        console.error("deleteDataServerInfoOnChain error")
      }

    },

    async createDataIntegrityOnChain({dispatch,state},payload){
      await dispatch('getUserCells',state.user_chain_info.lock_args)
      let type_args = textToHex(payload.data_id)

      let data = JSON.stringify(
        {data_hash:payload.data_hash,
          data_hash_sig:payload.data_hash_sig})
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.cells_pool[state.user_chain_info.lock_args].empty_cells,
        null,
        DATA_INTEGRITY,
        'create',
        state.user_chain_info.lock_args,
        type_args,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
      return tx_hash
    },

    async updateDataIntegrityOnChain({dispatch,state},payload){

      try {

        await dispatch('getUserCells',state.user_chain_info.lock_args)
        let type_args = textToHex(payload.data_id)
  
        let data = JSON.stringify(
          {data_hash:payload.data_hash,
            data_hash_sig:payload.data_hash_sig})
        data = textToHex(data)
        let tx_hash = await changeOnChain(
          state.cells_pool[state.user_chain_info.lock_args].empty_cells,
          state.cells_pool[state.user_chain_info.lock_args].filled_cells,
          DATA_INTEGRITY,
          'update',
          state.user_chain_info.lock_args,
          type_args,
          state.user_chain_info.lock_hash,
          data
        )
  
        console.debug(tx_hash)
        return tx_hash
        
      } catch (error) {
        console.error("updateDataIntegrityOnChain wrong",payload)
        throw(error)
      }



    },

    async deleteDataIntegrityOnChain({dispatch,state},payload){

      try {
        await dispatch('getUserCells',state.user_chain_info.lock_args)
        let type_args = textToHex(payload.data_id)
  
        let data = JSON.stringify(
          {data_hash:payload.data_hash,
            data_hash_sig:payload.data_hash_sig})
        data = textToHex(data)

        let tx_hash = await changeOnChain(
          state.cells_pool[state.user_chain_info.lock_args].empty_cells,
          state.cells_pool[state.user_chain_info.lock_args].filled_cells,
          DATA_INTEGRITY,
          'delete',
          state.user_chain_info.lock_args,
          type_args,
          state.user_chain_info.lock_hash,
          data
        )
  
        console.debug(tx_hash)
        return tx_hash


      } catch (error) {
        console.error("deleteDataIntegrityOnChain wrong",payload)
        throw(error)
      }



    },
    //async getOtherUserCells({commit,state}){
      
    //}
    async test(){

    }
  },
  modules: {
    ckplanet,
  }
})

