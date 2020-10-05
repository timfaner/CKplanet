import Vue from 'vue'
import Vuex from 'vuex'
import { getSummary,groupCells } from '@/ckb/utils'
import { getCells, queryAddresses } from '@/ckb/rpc'

import ckplanet from './ckplanet' 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_chain_info:{
      address:'',
      lock_script:null,
      lock_args:'',
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
      pk:'',
      sk:'',
      cert:'',
      access_token_public:'',   //生成公有url
      access_token_privite:'', //生成私有url
      data_encrypted_key:'', // 加密数据用
    },
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

  },
  actions: {
    async getUserCells({commit,state}){
      const cells = await getCells(state.user_chain_info.lock_args)
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
        balance_summary:{
          inuse: 0,
          free: 0,
          capacity: 0,
        }
      })}
      dispatch('getUserCells',state)
    },
        
    
  },
  modules: {
    ckplanet,
  }
})
