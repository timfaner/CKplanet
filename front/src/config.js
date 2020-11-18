

const TYPE = "devnet_azure"   //devnet_local,devnet_azure,testnet


const NETWORK_CONST = {
  "devnet_local":{
    kvdb_bucket:"XEdPUt7zsqFAXgBkCwsBiV",
    rpc_url:"http://127.0.0.1:8117/rpc",
    indexer_url:"http://127.0.0.1:8117/indexer",
    secp256k1:{
      codeh:"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      txh:"0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708"
    },
    dataserver_info:{
      //codeh:"0x4faa64ca257ea660e68f1f48adde1fa7bf02391f079b62228dfb3ff50bda9a5c",
      codeh:"0xb1d088237d1f1f761820e9e74c8c952f9891328bde4ca878429375f38d9edd5b",
      //txh:"0xde02fa1b11ce68808616a6492866fa468f510d5121cb891c75c94db93373909a"
      txh:"0x17d3b5249eaacbb3b4c88f1ad8b6f21a97c6a2927ece4feb5a8de2a8994fd41b"
    },
    data_interity:{
      codeh:"0xa23256c19384a16b76441e3a163c52c47456390bb57821f1ba9821284d22dd94",
      txh:"0x0cdbbf458296003a582b2af511fbd70e222b7727262ec5e1f74c5664fa9066ff"
    }
  },
  "devnet_azure":{
    kvdb_bucket:"MGpfP2JL8xDacsmQvhBa4Y",
    rpc_url:"http://ckplanet.beihanguni.cn:8114/rpc",
    indexer_url:"http://ckplanet.beihanguni.cn:8114/indexer",
    secp256k1:{
      codeh:"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      txh:"0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708"
    },
    dataserver_info:{
      codeh:"0x4faa64ca257ea660e68f1f48adde1fa7bf02391f079b62228dfb3ff50bda9a5c",
      txh:"0xc90b6ba81f48a842072426c070bb77c6c5c97591363f4b50e320766736a9cda6"
    },
    data_interity:{
      codeh:"0xa23256c19384a16b76441e3a163c52c47456390bb57821f1ba9821284d22dd94",
      txh:"0x73156275910b847c5071effafc845f895aeb45439e8ee2ec69e359f6a932afa6"
    }
  },
  "testnet":{
    kvdb_bucket:"EyermFFTE4QVgfsZjn2bCU",
    rpc_url:"http://ckplanet.beihanguni.cn:9111/rpc",
    indexer_url:"https://prototype.ckbapp.dev/testnet/indexer",
    secp256k1:{
      codeh:"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      txh:"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37"
    },
    dataserver_info:{
      codeh:"0x4faa64ca257ea660e68f1f48adde1fa7bf02391f079b62228dfb3ff50bda9a5c",
      txh:"0x0d38455a6bb1c19c93c92d5ecc86d911e33d14fc6c62990c8bf5d4fc17082c30"
    },
    data_interity:{
      codeh:"0xa23256c19384a16b76441e3a163c52c47456390bb57821f1ba9821284d22dd94",
      txh:"0xb20acfde617af969bc7b840bb9de615b861a2f46b4535164280a51b29e533160"
    }
  },
}




  
module.exports = {
    NETWORK_CONST,
    TYPE

}



