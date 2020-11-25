const { bytesToHex, parseAddress, hexToBytes } = require('@nervosnetwork/ckb-sdk-utils')
const { SECP256K1_BLAKE160_CODE_HASH,SECP256K1_BLAKE160_DEP_TXHASH,CODE_HASH_CAPACITY } = require('./const')

const formatCkb = value => {
  if (typeof value === 'undefined') {
    return undefined
  }
  let fraction = value % 100000000
  fraction = fraction.toString().padStart(8, '0')
  let integer = Math.floor(value / 100000000)
  const format = new Intl.NumberFormat({
    useGrouping: true,
  })
  integer = format.format(integer)
  return integer + '.' + fraction
}


const textToHex = text => {
  let result = text.trim()
  //if (result.startsWith('0x')) {
  //  return result
  //}
  result = bytesToHex(new TextEncoder("utf-8").encode(result))
  return result
}

const hexToText = hex => {
  let result = hex.trim()
  try {
    result = new TextDecoder("utf-8").decode(hexToBytes(result))
  } catch (error) {
    console.error('hexToUtf8 error:', error)
  }
  return result
}

const addressToArgs = address => {
  let payload = parseAddress(address, 'hex')
  return `0x${payload.substring(payload.startsWith('0x') ? 6 : 4)}`
}

const getSummary = cells => {
  const inuse = cells
    .filter(cell => cell.output_data !== '0x')
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)

  const free = cells
    .filter(cell => cell.output_data === '0x')
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)

  const capacity = inuse + free
  return {
    inuse,
    capacity,
    free,
  }
}

const getRawTxTemplate = () => {
  return {
    version: '0x0',
    // secp256k1_blake160 transaction hash and index
    cellDeps: [
      {
        outPoint: {
          txHash: SECP256K1_BLAKE160_DEP_TXHASH,
          index: '0x0',
        },
        depType: 'depGroup',
      },
    ],
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  }
}

const getTxTemplateWithCellsDeps = (tx,type) => {
  tx.cellDeps.push(type.cell_deps)

  return tx
}

const groupCells = cells => {
  return {
    emptyCells: cells.filter(cell => (!cell.output_data || cell.output_data === '0x') && cell.output.type === null),
    filledCells: cells.filter(cell => cell.output_data !== '0x' || cell.output.type !== null),
  }
}

const getLockScript = args => {
  return {
    codeHash: SECP256K1_BLAKE160_CODE_HASH,
    hashType: 'type',
    args,
  }
}

const getTypeScript = (args,codeHash) =>{
  return{
    codeHash,
    hashType: 'code',
    args,
  }
}


const fileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
})


function filterCellsWithTypeScript(filed_cells,{args,codeHash,hashType}){
  let cells = []
  if (filed_cells.length === 0){
    return cells
  }
  for (const cell of filed_cells){
    if( cell.output.type !==null ){
      if( cell.output.type.args === args &&
          cell.output.type.code_hash === codeHash &&
          cell.output.type.hash_type === hashType){
            cells.push(cell)
          }
    }
  }
  return cells
}

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 const BN = require('bn.js')

 function getScriptCapacity(script){
  let args_length = 0
  if (script.args !== "0x" && script.args !== null){
   args_length = (script.args.length -2)/2 // strip '0x' 
  }
  
  let b =new BN(0)
  b = b.add(CODE_HASH_CAPACITY).add(new BN("100000000")).add(new BN(args_length * 100000000)) 
  return b
 }


 //unicode编码
function encodeUnicode(str) {
  var res = [];
  for (var i = 0; i < str.length; i++) {
      res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
  }
  return "\\u" + res.join("\\u");
}

//unicode解码
function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}

import snakeCaseKeys  from'snakecase-keys'

function camelToUnderscore(key) {
  var result = key.replace( /([A-Z])/g, " $1" );
  return result.split(' ').join('_').toLowerCase();
}

function convertTx(tx){
  if(tx===undefined ||tx===null){
    console.warn("Empty tx to convert")
    return
  }
  for(let  dep of tx["cellDeps"]){
    dep.depType = camelToUnderscore(dep.depType)
  }
  tx = snakeCaseKeys(tx) //将key 从camelcase转换成snake case 。e.g. {fooBar:1} => {foo_bar:1}
  return tx
}

function isEquivalent(a, b) {

  return JSON.stringify(a) === JSON.stringify(b)
}

export  {
  filterCellsWithTypeScript,
  encodeUnicode,
  decodeUnicode,
  formatCkb,
  textToHex,
  hexToText,
  addressToArgs,
  getSummary,
  getRawTxTemplate,
  groupCells,
  getLockScript,
  makeId,
  getTxTemplateWithCellsDeps,
  getTypeScript,
  getScriptCapacity,
  convertTx,
  fileToBase64,
  isEquivalent
}