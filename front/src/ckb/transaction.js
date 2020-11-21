import * as BN from 'bn.js'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import {  getRawTxTemplate,getTxTemplateWithCellsDeps,getScriptCapacity,getLockScript,filterCellsWithTypeScript,convertTx } from '@/ckb/utils'
import { MIN_CAPACITY, TRANSACTION_FEE, Operator, PW_LOCK } from '@/ckb/const'
import { signTransaction,requestAuth,sendTransaction,getTransaction} from '@/ckb/rpc'
import CKplanet_Builder from './ckplanet-builder'
import { Amount, AmountUnit, Cell, CellDep, OutPoint, Script } from '@lay2/pw-core'




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
      alert('You  do not have enough CKB!')
      return
    }
    return {rawTx,cells_to_delete}
  }



 const sleep = function(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
  }


async function changeOnChain(
  wallet, //FIXME temporarily determine type of builder to use ,  
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

    //lock、type制作，inputcell去掉type、data

    let rawTx,cells_to_delete
    if(wallet==="eth"){

      
      const celldep_t =   new CellDep("code",new OutPoint(
        current_cells_type.cell_deps.outPoint.txHash,
        current_cells_type.cell_deps.outPoint.index
      ))
      
      const script_t = new Script(
        current_cells_type.script.codeHash,
        type_args,
        current_cells_type.script.hashType)
      
      const typp = {
        cellDep: celldep_t,
        script: script_t

      }

      //FIXME support keypering
      let tmp = PW_LOCK.script
      tmp.args = lock_args

      const lock = {
        cellDep : PW_LOCK.cellDep,
        script : tmp
      }

      let inputCell,outputCell
      if (mode === "delete" || mode === "update") {
        inputCell = new Cell(
          new Amount(current_cell.output.capacity, AmountUnit.shannon),
          Script.fromRPC(current_cell.output.lock),
          Script.fromRPC(current_cell.output.type),
          OutPoint.fromRPC(current_cell.out_point),
          current_cell.output_data
        );
        inputCell.setHexData("0x");
        if (mode === "delete")
          inputCell.type = undefined
      }

      if (mode === "create" || mode === "update") {
        outputCell = new Cell(
          new Amount("500"),
          lock.script,
          typp.script
        );
        if (data.startsWith("0x")) {
          outputCell.setHexData(data);
        } else {
          outputCell.setData(data);
        }
        outputCell.resize();
      }

        rawTx =   new CKplanet_Builder(inputCell,outputCell,lock,typp)
        cells_to_delete = undefined

    }

    else if(wallet==="ckb"){
    let {tmp,tmp1} =  jointTx(
      empty_cells_pool,
      current_cell,
      mode,
      data,
      getLockScript(lock_args),
      current_cells_type,
      type_args
    )
    rawTx = tmp
    cells_to_delete = tmp1

    }

  
  try {




    window.app.$loading({text:"Please authorize in the wallet"})


    let tx
    if(wallet==="ckb"){
      const authToken = window.localStorage.getItem('authToken')
      if (!authToken) {
        console.error('No auth token')
        return
      }
       tx = await signTransaction(rawTx, authToken, lock_hash)
       tx = convertTx(tx) //将key 从camelcase转换成snake case 。e.g. {fooBar:1} => {foo_bar:1}
    }
    else if(wallet==="eth"){

      tx =  await window.ppw.sendTransaction(rawTx)
      
    }

    let e = new CustomEvent("tx-status",{ 'detail' :{ tx_hash:'',status:"preparing to sign tx"}})
    window.document.body.dispatchEvent(e)


    window.app.$loading({text:"Please authorize in the wallet"}).close()



    e = new CustomEvent("tx-status",{ 'detail' :{ tx_hash:'',status:"sending tx to node"}})
    window.document.body.dispatchEvent(e)

    console.log(tx)
    let tx_hash
    if(wallet==="eth")
      tx_hash = tx
    else if(wallet === "ckb")
      tx_hash= await sendTransaction(tx)

    
     e = new CustomEvent("tx-status",{ 'detail' :{ tx_hash:tx_hash,status:"waiting to commited"}})
    window.document.body.dispatchEvent(e)

    let status = ''
 
    
    
    while(status !== "committed"){
      await sleep(1000)
      let tmp = await getTransaction(tx_hash)
      
      
      if(tmp===null){
        console.warn(tx_hash + " Not found")
      }
      else{
        if (tmp.tx_status.status === "committed"){
          status =  'committed'
          console.debug(tx_hash +  " committed")
        }
        else{
          console.debug(tx_hash +   ' '+  tmp.tx_status.status)
        }
        let e = new CustomEvent("tx-status",{ 'detail' :{ tx_hash:tx_hash,status:tmp.tx_status.status}})
        window.document.body.dispatchEvent(e)
      }
    }



    return {tx_hash,cells_to_delete}
  } catch (error) {
    let   e = new CustomEvent("waitwallet",{ 'detail' :{status:"error"}})
    window.document.body.dispatchEvent(e)
    console.error("change on chain error",error)
    throw(error)
    
  }


}

function registerTxWatcher(){
  window.tx_watch = {}
}
function addTxToWatcher(tx_hash,msg){
  
  window.tx_watch[tx_hash] = setInterval(  async (tx_hash,msg)=> {
    console.log(tx_hash)
    console.log(msg)
    let tmp = await getTransaction(tx_hash)
    if(tmp===null){
      console.warn(tx_hash + " Not found")
    }
    else{
      if (tmp.tx_status.status === "committed"){
        console.debug(tx_hash +  " committed")
        let e = new CustomEvent("tx-committed",{'tx_hash':tx_hash,'msg':msg})
        window.document.body.dispatchEvent(e)
        window.clearInterval(window.tx_watch[tx_hash])

      }
      else{
        console.debug(tx_hash +   ' '+  tmp.tx_status.status)
      }
    }
  },1000,tx_hash,msg)
}

function registerTxNotify(vue){
 vue
}


export   {

    jointTx,
    getWalletAuth,
    collectCells,
    changeOnChain,
    registerTxWatcher,
    addTxToWatcher,
    registerTxNotify,

}