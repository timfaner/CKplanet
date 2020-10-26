
import { expect } from "chai"
import {        
    generateAESKey, 
    encryptData_c,
    decryptData_c,
    generatePrivKey,
    signData,
    verifyData,
    getPubKey,
    generateECDHKey,
    hashFunc} from "../../src/ckb/crypto"

hashFunc


const  format_test = [
    {function: generatePrivKey,args:'',length:66,prefix:true},  //32 bytes in hex text length is 64,add "0x" is 66
    {function: getPubKey,args:[generatePrivKey()],length:68,prefix:true}, 
    {function: hashFunc ,args:'',length:66,prefix:true},
    {function: generateAESKey ,args:[''],length:32,prefix:false},
    {function: generateECDHKey,args:[generatePrivKey(),getPubKey(generatePrivKey())],length:32,prefix:false}
]

const dataset = [
    'ijaeodfkmslFEAOKKMDL23r9u48ty75uhitgjknbvmlv',
    //'',
    '123435tgrfv;l[p,g,',
    '!@#$%^&*()@#¥%……&*（）hi的房间内贼教案benokfzei挨饿见过暴发户南京召开',
    JSON.stringify({
        time: Date.now(),
        content:`中国新闻周刊：大规模或者说全民核酸检测，还是花费了比较大的人力、物力、财力。今后是否该有更优化的方案？

    吴尊友：我们讲科学防控，精准施策，就是根据需要来做，北京当时也提出来要对全市2000多万人开展核酸筛查，专家反复多次向防控领导组提建议，觉得没有必要，最后防控指挥部听取了专家意见，所以核酸筛查到了1000万左右就停下来了，它是以新发地为源头，向周围辐射，逐步延伸核酸检测范围。
    
    当检测范围扩大到一定程度时，再检测几万人、几十万人查不出来，数据已经说明问题了。如果北京再额外做1000万人核酸检测，社会成本就大了，也没必要。青岛有那样一个决心去做，也是一种矫枉过正。`})

]

describe("test output format",function(){

    format_test.forEach(function(test_case){
        it(test_case.function.name + " should length at " + test_case.length,function(){
            let res = (test_case.function)(...test_case.args)

            if(test_case.prefix)
                expect(res,"start with 0x").to.match(/^0x/)

            expect(res).to.have.length(test_case.length)
        })
    })
})
    

describe("test aes correctness",function(){
    dataset.forEach(function(data){
        let key = generateAESKey(generatePrivKey())
        it("should return same resualt",function(){
            let {encrypted_data} = encryptData_c(data,key)
            let decrypted_data = decryptData_c(encrypted_data,key)
            expect(decrypted_data).to.equal(data)
        })
    })
    dataset.forEach(function(password){
        it("should accept any password",function(){
            expect(generateAESKey(password)).to.have.length(32)
        })
    })
})


describe("test ecdsa correctness",function(){
    dataset.forEach(function(data){
        let sk = generatePrivKey()
        let pk = getPubKey(sk)
        it("should passed verify ",function(){
            let sig = signData(sk,data)
            let res = verifyData(sig,data,pk)
            expect(res).to.equal(true)
        })
    })
})

describe("test ecdh correctness",function(){
    dataset.forEach(function(){
        let sk = generatePrivKey()
        let pk = getPubKey(sk)
        let sk1 = generatePrivKey()
        let pk1 = getPubKey(sk1)
        it("should passed verify ",function(){
            let key1 = generateECDHKey(sk,pk1)
            let key2 = generateECDHKey(sk1,pk)
            expect(key1).to.equal(key2)

        })
    })
})
