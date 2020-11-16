import { RICH_NODE_RPC_URL,KEYPERING_URL, RICH_NODE_INDEXER_URL, SECP256K1_BLAKE160_CODE_HASH, DAPP_DESCRIPTION } from './const' 
import {keypering_res,MOCK_API}  from "./test"


const getCellsByLocks = async lockArgs => {
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          code_hash: SECP256K1_BLAKE160_CODE_HASH,
          hash_type: 'type',
          args: lockArgs,
        },
        script_type: 'lock',
      },
      'asc',
      '0x3e8',
    ],
  }
  const body = JSON.stringify(payload, null, '  ')
  try {
    let res = await fetch(RICH_NODE_INDEXER_URL, {
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

const requestAuth = async description => {
  try {
    let res = await fetch(KEYPERING_URL, {
      method: 'POST',
      body: JSON.stringify({
        id: 2,
        jsonrpc: '2.0',
        method: 'auth',
        params: {
          description,
        },
      }),
    })
    res = await res.json()
    return res.result.token
  } catch (error) {
    console.error('error', error)
  }
}

const queryAddresses = async token => {
  try {
    let res = await fetch(KEYPERING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: 3,
        jsonrpc: '2.0',
        method: 'query_addresses',
      }),
    })
    res = await res.json()
    return res.result
  } catch (error) {
    console.error('error', error)
  }
}

const signAndSendTransaction = async (rawTx, token, lockHash) => {
  let rawTransaction = rawTx
  rawTransaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  }
  let res = {}
  try {
     res = await fetch(KEYPERING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: 4,
        jsonrpc: '2.0',
        method: 'sign_and_send_transaction',
        params: {
          tx: rawTransaction,
          lockHash,
          description: DAPP_DESCRIPTION,
        },
      }),
    })
    res =  await res.json()
    // TODO 错误码处理
    return res.result.txHash
  } catch (error) {
    console.error('error', error,res)
  }
}

/**
 * 通过keypering 对交易进行签名
 * @param {*} rawTx 
 * @param {*} token 
 * @param {*} lockHash 
 */

const signTransaction = async (rawTx, token, lockHash) => {
  let rawTransaction = rawTx
  rawTransaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  }
  let res = {}
  try {
     res = await fetch(KEYPERING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: 4,
        jsonrpc: '2.0',
        method: 'sign_transaction',
        params: {
          tx: rawTransaction,
          lockHash,
          description: DAPP_DESCRIPTION,
        },
      }),
    })
    res =  await res.json()
    
    if("error" in res){
      throw(res.message)
    }
    console.log(res.result.tx)
    return res.result.tx
  } catch (error) {
    console.error('error', error,res)

  }
}

/**
 * 通过node rpc 发送交易（不通过keypering 发送，以方便查询是不是在memory pool中)
 * @param {*} tx 
 */
const sendTransaction = async (tx) => {

  let res = {}
  try {
     res = await fetch(RICH_NODE_RPC_URL, {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        id: 4,
        jsonrpc: '2.0',
        method: 'send_transaction',
        params: [
          tx,
          ]
      }),
    })
    res =  await res.json()

    if("error" in res){
      throw(res.error.message)
    }

    return res.result
    
  } catch (error) {
    console.error('error', error,res)

  }
}


const getTransaction = async (txHash) => {

  let res = {}
  try {
     res = await fetch(RICH_NODE_RPC_URL, {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        id: 4,
        jsonrpc: '2.0',
        method: 'get_transaction',
        params: [
          txHash,
          ]
      }),
    })
    res =  await res.json()
    if("error" in res){
      throw(res.error.message)
    }
    return res.result
  } catch (error) {
    console.error('error', error,res)

  }
}






const signMessage = async (msg,address,token) => {
  let payload = {
    message:msg,
    address,
  }

  if (MOCK_API.SIGN_MESSAGE){
    return keypering_res.signMessage(payload).result
  }
  try {
    let res = await fetch(KEYPERING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: 3,
        jsonrpc: '2.0',
        
        method: 'sign_message',
        params: payload
      }),
    })
    res = await res.json()

    //TODO 错误处理
    return res.result.sig.slice(0,130) //不要最后的bytes
  } catch (error) {
    console.error('error', error)
  }
}

export  {
  getCellsByLocks,
  requestAuth,
  queryAddresses,
  signAndSendTransaction,
  signMessage,
  signTransaction,
  sendTransaction,
  getTransaction,
}