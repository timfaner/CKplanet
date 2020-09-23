const BN = require('bn.js')

const RICH_NODE_RPC_URL = 'https://prototype.ckbapp.dev/testnet/rpc'
const RICH_NODE_INDEXER_URL = 'https://prototype.ckbapp.dev/testnet/indexer'
const KEYPERING_URL = 'http://localhost:3102'

const MIN_CAPACITY = new BN('6100000000')
const TRANSACTION_FEE = new BN('10000000')

const CODE_HASH_CAPACITY = new BN('3200000000')


const DAPP_DESCRIPTION = 'Simplest DApp are requesting to sign and send transactions'

const Operator = {
  Create: 'create',
  Update: 'update',
  Delete: 'delete',
}

const SECP256K1_BLAKE160_CODE_HASH = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'
const SECP256K1_BLAKE160_DEP_TXHASH = '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37'
const DATASERVER_INFO_CODE_HASH = ''
const DATA_INTEGRITY_CODE_HASH = ''
const DATASERVER_INFO_DEP_TXHASH = ''
const DATA_INTEGRITY_DEP_TXHASH = ''


const DATASERVER_INFO = {
  cell_deps:{
    outPoint:{
      txHash:DATASERVER_INFO_DEP_TXHASH,
      index: '0x0',
    },
    depType:'code'
  },
  script:{
    code_hash:DATASERVER_INFO_CODE_HASH,
    args:'',
    hash_type:'data'
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
    code_hash:DATA_INTEGRITY_CODE_HASH,
    args:'',
    hash_type:'data'
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
}