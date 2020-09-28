const {hashfunction,
        generatePrivKey,
        importPrivKey,
        signData,
        verifyData,
        exportPrivKey,
        exportPubKey,
        getPubKey} = require("@/ckb/crypto")

const getMpk = async (server_url) =>{
    let payload = {

    }

    const body = JSON.stringify(payload, null, '  ')
    try {
        let res = await fetch(server_url, {
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


const getAuth = async (server_url,access_token,msg,cpk) =>{

    let payload = {
        access_token,
        msg,
        cpk,
    }

    const body = JSON.stringify(payload, null, '  ')
    try {
        let res = await fetch(server_url, {
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

//TODO 有或者没有txid
const uploadData = async (server_url,dataId,data,accessToken,sig,txid,dataHash,pk,cert) =>{
    let payload = {
        dataId,
        data,
        accessToken,
        sig,
        txid,
        dataHash,
        pk,
        cert,
    }

    const body = JSON.stringify(payload, null, '  ')
    try {
        let res = await fetch(server_url, {
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


const getData = async (server_url,url) =>{
    let payload = {
        url,
    }

    const body = JSON.stringify(payload, null, '  ')
    try {
        let res = await fetch(server_url, {
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


const generateDataSig = (sk,data) => {
    return(signData(sk,data))
}


module.exports = {
    getMpk,
    getAuth,
    uploadData,
    getData,
    generateDataSig,

}