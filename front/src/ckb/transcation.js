import * as BN from 'bn.js'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import { textToHex, getRawTxTemplate, } from '@/ckb/utils'
import { MIN_CAPACITY, TRANSACTION_FEE, Operator } from '@/ckb/const'
import { signAndSendTransaction,requestAuth,  } from '@/ckb/rpc'


const getAuth = async () =>{
  console.log("geting auth....")
  const token = await requestAuth('CKplanet request login')
  // TODO 错误处理
  window.localStorage.setItem('authToken', token)
}



//cell池更新函数 结合vuex

//从cell池收集cells，然后拼接tx，然后发送，发送完加入监测列表，检测完成后回调（是否commited）
async function  collectCells(){
  return
}


async function jointTx(currentCell = null,mode,data,lockScript,typeScript) {
    const rawTx = getRawTxTemplate()
    let outputCapacity = new BN(0)
    // Generate outputs and outputsData
    if (mode === Operator.Create || mode === Operator.Update) {
    data = textToHex(data)
      if (!data || data.length % 2 !== 0) {
        alert('The length of data must be an even number')
        return
      }
      outputCapacity = outputCapacity.add(new BN(hexToBytes(data).byteLength * 100000000)).add(MIN_CAPACITY)
      rawTx.outputs.push({
        capacity: `0x${outputCapacity.toString(16)}`,
        lock: lockScript,
        type: typeScript,
      })
      rawTx.outputsData.push(data)
    }
    outputCapacity = outputCapacity.add(TRANSACTION_FEE)
    // Collect inputs
    let cells = await collectCells()
    let inputCapacity = new BN(0)
    if (mode === Operator.Update || mode === Operator.Delete) {
      cells = [currentCell, ...cells]
    }
    for (let cell of cells) {
      rawTx.inputs.push({
        previousOutput: {
          txHash: cell.out_point.tx_hash,
          index: cell.out_point.index,
        },
        since: '0x0',
      })
      rawTx.witnesses.push('0x')
      inputCapacity = inputCapacity.add(new BN(parseInt(cell.output.capacity)))
      if (inputCapacity.sub(outputCapacity).gte(MIN_CAPACITY)) {
        const changeCapacity = inputCapacity.sub(outputCapacity)
        rawTx.outputs.push({
          capacity: `0x${changeCapacity.toString(16)}`,
          lock: lockScript,
        })
        rawTx.outputsData.push('0x')
        break
      }
    }
    if (inputCapacity.sub(outputCapacity).lt(MIN_CAPACITY)) {
      alert('You have not enough CKB!')
      return
    }
    return rawTx
  }


//TODO lockHash 
async  function sendTx(rawTx,lockHash){
    const authToken = window.localStorage.getItem('authToken')
    if (!authToken) {
      console.error('No auth token')
      return
    }
    await signAndSendTransaction(rawTx, authToken, lockHash)
  }


export   {
    sendTx,
    jointTx,
    getAuth,
    collectCells,
}