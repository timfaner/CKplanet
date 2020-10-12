const BN = require('bn.js')

const RICH_NODE_RPC_URL = 'http://127.0.0.1:8117/rpc'
const RICH_NODE_INDEXER_URL = 'http://127.0.0.1:8117/indexer'
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

const SECP256K1_BLAKE160_CODE_HASH = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'
const SECP256K1_BLAKE160_DEP_TXHASH = '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708'

const DATASERVER_INFO_CODE_HASH = '0x4faa64ca257ea660e68f1f48adde1fa7bf02391f079b62228dfb3ff50bda9a5c'
const DATA_INTEGRITY_CODE_HASH = '0xa23256c19384a16b76441e3a163c52c47456390bb57821f1ba9821284d22dd94'

const DATASERVER_INFO_DEP_TXHASH = '0xd33790df5eb8d6701ad8f51a7ea7936f275bdf6201713bfe020773b4bf332782'
const DATA_INTEGRITY_DEP_TXHASH = '0xdd7ab866b799f3228bb9929e6340a81ef18a60a0fb768751fa8ab6f1a5beb3a2'


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





module.exports = {
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
  CELLS_CACHE_TIME
}