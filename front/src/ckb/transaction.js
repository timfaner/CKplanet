import * as BN from 'bn.js'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import {  getRawTxTemplate,getTxTemplateWithCellsDeps,getScriptCapacity,getLockScript,filterCellsWithTypeScript } from '@/ckb/utils'
import { MIN_CAPACITY, TRANSACTION_FEE, Operator } from '@/ckb/const'
import { signAndSendTransaction,requestAuth,} from '@/ckb/rpc'


const getWalletAuth = async () =>{
  try {
  console.log("geting auth....")
  const token = await requestAuth('CKplanet request login')
  // TODO 错误处理
  window.localStorage.setItem('authToken', token)
  }
  catch (error) {
    console.error('error',error)
  }
}



//cell池更新函数 结合vuex

//从cell池收集cells，然后拼接tx，然后发送，发送完加入监测列表，检测完成后回调（是否commited）
 function  collectCells(empty_cells){
  return empty_cells
}



// args、data均为已经序列化之后的数据
 function jointTx(empty_cells,currentCell = null,mode,data,lock_script,type = null,args = '') {
  //args 是string  , type 是定义在const中的
  const rawTx = getRawTxTemplate()
    var type_script = ''
    if (type !==null){
      getTxTemplateWithCellsDeps(rawTx,type)
      type_script = type.script
      
      if (!args || args.length % 2 !== 0) {
        alert('The length of data must be an even number')
        return
      }
      type_script.args = args
    }

    let outputCapacity = new BN(0)
    
    
    // Generate outputs and outputsData
    if (mode === Operator.Create || mode === Operator.Update) {
    
      if (!data || data.length % 2 !== 0) {
        alert('The length of data must be an even number')
        return
      }
      // 添加 type_script 的capacity
      outputCapacity = outputCapacity.add(new BN(hexToBytes(data).byteLength * 100000000))
      .add(MIN_CAPACITY)

      if (type !== null){
        let tc = getScriptCapacity(type_script)
        outputCapacity = outputCapacity.add(tc)
      }
      
      
      rawTx.outputs.push({
        capacity: `0x${outputCapacity.toString(16)}`,
        lock: lock_script,
        type: type_script,
      })
      rawTx.outputsData.push(data)
    }
    outputCapacity = outputCapacity.add(TRANSACTION_FEE)
    // Collect inputs
    let cells =  collectCells(empty_cells)
    let inputCapacity = new BN(0)
    if (mode === Operator.Update || mode === Operator.Delete) {
      cells = [currentCell, ...cells]
    }
    let cells_to_delete = []
    for (let cell of cells) {
      cells_to_delete.push(cell)
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
          lock: lock_script,
        })
        rawTx.outputsData.push('0x')
        break
      }
    }
    if (inputCapacity.sub(outputCapacity).lt(MIN_CAPACITY)) {
      alert('You have not enough CKB!')
      return
    }
    return {rawTx,cells_to_delete}
  }


//TODO lockHash 
async  function sendTx(rawTx,lockHash){
    const authToken = window.localStorage.getItem('authToken')
    if (!authToken) {
      console.error('No auth token')
      return
    }
    let tx_hash = await signAndSendTransaction(rawTx, authToken, lockHash)
    return tx_hash
  }



async function changeOnChain(
  empty_cells_pool,
  current_cells_pool,
  current_cells_type,
  mode,
  lock_args,
  type_args,
  lock_hash,
  data){


    let current_cell = null
    if (mode === Operator.Update || mode === Operator.Delete){
      current_cells_type.script.args = type_args
      let cells = filterCellsWithTypeScript(
        current_cells_pool,
        current_cells_type.script,
        )
      
      // update 为空，则转成create
      if (mode === Operator.Update){
        if(cells.length === 0){
          current_cell = null,
          mode = Operator.Create
        }
        else  if (cells.length === 1){
          current_cell = cells[0]
        }
        else{
          console.error("More then one cells located",mode,cells)
          return null
        }
      }
      // delete  为一个，则报错
      else {
        if(cells.length !== 1){
          console.error("More then one cells located",mode,cells)
          return null
        }
        current_cell = cells[0]
      }

      current_cell = cells[0]
    }


  let {rawTx,cells_to_delete} =  jointTx(
    empty_cells_pool,
    current_cell,
    mode,
    data,
    getLockScript(lock_args),
    current_cells_type,
    type_args
  )
  let tx = rawTx
  
  try {
    let tx_hash = await sendTx(tx, lock_hash)

    //TODO 错误处理
    return {tx_hash,cells_to_delete}
  } catch (error) {
    console.error(error)
  }


}


export   {
    sendTx,
    jointTx,
    getWalletAuth,
    collectCells,
    changeOnChain
}