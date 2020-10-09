import Vue from 'vue'
import Vuex from 'vuex'
import { getSummary,groupCells } from '@/ckb/utils'
import { getCellsByLocks, queryAddresses,signMessage } from '@/ckb/rpc'

import ckplanet from './ckplanet' 

import {getMpk,getAuth} from '@/ckb/data_server'

import {changeOnChain} from "@/ckb/transaction"

import {DATASERVER_INFO,DATA_INTEGRITY,DAPP_ID } from '@/ckb/const'
import { textToHex } from '../ckb/utils'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    user_cells:{
      empty_cells:null,
      filled_cells:null,
    },
    user_data_server_info:{
      ip:'',
      mpk:'',  
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
    }
  },
  mutations: {
    updateUser(state,user_chain_info){
      state.user_chain_info = user_chain_info
    },
    updateUserCells(state,cells){
      const { emptyCells, filledCells } = groupCells(cells)
      state.user_cells.empty_cells = emptyCells
      state.user_cells.filled_cells = filledCells

      if(cells && cells.length > 0){
        state.user_chain_info.balance_summary = getSummary(cells)}
    },
    updateDataServer(state,payload){
      state.user_data_server_info.ip = payload.ip
      state.user_data_server_info.mpk = payload.res.mpk

    },
    updatePublicId(state,payload){
      if ('result' in payload){
        state.user_id_public.access_token = payload.result
      }
      else if ('pk' in payload && 'sk' in payload && 'cert' in payload ){
        state.user_id_public.pk = payload.pk
        state.user_id_public.sk = payload.sk
        state.user_id_public.cert = payload.cert
      }
    },

    updatePrivateId(state,payload){
      if ('result' in payload){
        state.user_id_private.access_token = payload.result
      }
      else if ('pk' in payload && 'sk' in payload && 'cert' in payload ){
        state.user_id_private.pk = payload.pk
        state.user_id_private.sk = payload.sk
        state.user_id_private.cert = payload.cert
      }
    },


  },
  actions: {
    async getUserCells({commit,state}){
      const cells = await getCellsByLocks(state.user_chain_info.lock_args)
      commit("updateUserCells",cells)
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
      dispatch('getUserCells',state)
    },
        

    async getDataServer({commit}){
      // TODO ip获取
      let ip = "127.0.0.1:8080"

      let res = await getMpk(ip)
      console.log(res)
      commit("updateDataServer",
      {ip,res})
    },


    async getPubId({commit,state}){
      const authToken = window.localStorage.getItem('authToken')
      const ip = state.user_data_server_info.ip
      let res = await signMessage("public","Get public token",authToken)
      commit("updatePublicId",res)

      // TODO 测试api
      res = await getAuth(
        ip,
        state.user_id_public.access_token,
        "public",
        state.user_chain_info.public_key
        )
        commit("updatePublicId",res)
    },
    async getPriId({commit,state}){

      const authToken = window.localStorage.getItem('authToken')
      const ip = state.user_data_server_info.ip
      
      let res = await signMessage("private","Get private token",authToken)
      commit("updatePrivateId",res)
      res = await getAuth(
        ip,
        state.user_id_private.access_token,
        "private",
        state.user_chain_info.public_key
        )
        commit("updatePrivateId",res)
    },

    async createDataServerInfoOnChain({dispatch,state},DataServerInfo){
      // 更新本用户的cell池
      await dispatch('getUserCells',state)
      let dappID = textToHex(DAPP_ID)

      let data = JSON.stringify(DataServerInfo)
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.user_cells.empty_cells,
        null,
        DATASERVER_INFO,
        'create',
        state.user_chain_info.lock_args,
        dappID,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
    },

    async updateDataServerInfoOnChain({dispatch,state},DataServerInfo){
      // 更新本用户的cell池
      await dispatch('getUserCells',state)
      let dappID = textToHex(DAPP_ID)

      let data = JSON.stringify(DataServerInfo)
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.user_cells.empty_cells,
        state.user_cells.filled_cells,
        DATASERVER_INFO,
        'update',
        state.user_chain_info.lock_args,
        dappID,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
    },

    async deleteDataServerInfoOnChain({dispatch,state}){
      // 更新本用户的cell池
      await dispatch('getUserCells',state)
      let dappID = textToHex(DAPP_ID)


      let tx_hash = await changeOnChain(
        state.user_cells.empty_cells,
        state.user_cells.filled_cells,
        DATASERVER_INFO,
        'delete',
        state.user_chain_info.lock_args,
        dappID,
        state.user_chain_info.lock_hash,
        ''
      )

      console.debug(tx_hash)
    },

    async createDataIntegrityOnChain({dispatch,state},payload){
      await dispatch('getUserCells',state)
      let type_args = textToHex(payload.data_id)

      let data = JSON.stringify(
        {data_hash:payload.data_hash,
          data_hash_sig:payload.data_hash_sig})
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.user_cells.empty_cells,
        null,
        DATA_INTEGRITY,
        'create',
        state.user_chain_info.lock_args,
        type_args,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
    },

    async updateDataIntegrityOnChain({dispatch,state},payload){
      await dispatch('getUserCells',state)
      let type_args = textToHex(payload.data_id)

      let data = JSON.stringify(
        {data_hash:payload.data_hash,
          data_hash_sig:payload.data_hash_sig})
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.user_cells.empty_cells,
        state.user_cells.filled_cells,
        DATA_INTEGRITY,
        'update',
        state.user_chain_info.lock_args,
        type_args,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
    },

    async deleteDataIntegrityOnChain({dispatch,state},payload){
      await dispatch('getUserCells',state)
      let type_args = textToHex(payload.data_id)

      let data = JSON.stringify(
        {data_hash:payload.data_hash,
          data_hash_sig:payload.data_hash_sig})
      data = textToHex(data)

      let tx_hash = await changeOnChain(
        state.user_cells.empty_cells,
        state.user_cells.filled_cells,
        DATA_INTEGRITY,
        'delete',
        state.user_chain_info.lock_args,
        type_args,
        state.user_chain_info.lock_hash,
        data
      )

      console.debug(tx_hash)
    }
    //async getOtherUserCells({commit,state}){
      
    //}
    
  },
  modules: {
    ckplanet,
  }
})

