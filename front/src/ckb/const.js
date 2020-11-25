const BN = require('bn.js')

import {TYPE,NETWORK_CONST} from "@/config.js"
const {  CHAIN_SPECS } = require("@lay2/pw-core")

const RICH_NODE_RPC_URL = NETWORK_CONST[TYPE].rpc_url
const RICH_NODE_INDEXER_URL = NETWORK_CONST[TYPE].indexer_url

const WS_SERVER_URL = "ws://localhost:9216"

const KEYPERING_URL = 'http://localhost:3102'

const MIN_CAPACITY = new BN('6100000000')
const TRANSACTION_FEE = new BN('10000000')

const CODE_HASH_CAPACITY = new BN('3200000000')

const CELLS_CACHE_TIME = 5000 //in ms

const DAPP_ID = "ckplanet"
const DAPP_DESCRIPTION = 'Simplest DApp are requesting to sign and send transactions'

const Operator = {
  Create: 'create',
  Update: 'update',
  Delete: 'delete',
}


const SECP256K1_BLAKE160_LOCK = CHAIN_SPECS.Aggron.defaultLock
const PW_LOCK = CHAIN_SPECS.Aggron.pwLock

const SECP256K1_BLAKE160_CODE_HASH =  NETWORK_CONST[TYPE].secp256k1.codeh
const SECP256K1_BLAKE160_DEP_TXHASH = NETWORK_CONST[TYPE].secp256k1.txh

SECP256K1_BLAKE160_LOCK.script.codeHash = SECP256K1_BLAKE160_CODE_HASH
SECP256K1_BLAKE160_LOCK.cellDep.outPoint.txHash = SECP256K1_BLAKE160_DEP_TXHASH

const DATASERVER_INFO_DEP_TXHASH = NETWORK_CONST[TYPE].dataserver_info.txh
const DATASERVER_INFO_CODE_HASH = NETWORK_CONST[TYPE].dataserver_info.codeh




const DATA_INTEGRITY_DEP_TXHASH = NETWORK_CONST[TYPE].data_interity.txh
const DATA_INTEGRITY_CODE_HASH = NETWORK_CONST[TYPE].data_interity.codeh



const DATASERVER_INFO = {
  cell_deps:{
    outPoint:{
      txHash:DATASERVER_INFO_DEP_TXHASH,
      index: '0x0',
    },
    depType:'code'
  },
  script:{
    codeHash:DATASERVER_INFO_CODE_HASH,
    args:'',
    hashType:'data'
  },
}

const DATA_INTEGRITY = {
  cell_deps:{
    outPoint:{
      txHash:DATA_INTEGRITY_DEP_TXHASH,
      index: '0x0',
    },
    depType:'code'
  },
  script:{
    codeHash:DATA_INTEGRITY_CODE_HASH,
    args:'',
    hashType:'data'
  },
}





 export  {
  RICH_NODE_RPC_URL,
  RICH_NODE_INDEXER_URL,
  MIN_CAPACITY,
  TRANSACTION_FEE,
  SECP256K1_BLAKE160_CODE_HASH,
  SECP256K1_BLAKE160_DEP_TXHASH,
  KEYPERING_URL,
  DAPP_DESCRIPTION,
  Operator,
  DATASERVER_INFO,
  DATA_INTEGRITY,
  CODE_HASH_CAPACITY,
  DAPP_ID,
  CELLS_CACHE_TIME,
  SECP256K1_BLAKE160_LOCK,
  PW_LOCK,
  WS_SERVER_URL
}