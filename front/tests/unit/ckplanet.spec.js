import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'


describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})


import { getUrl as getUrls, DATA_STRUCT, getDataTemplate, vaildDataType,getDataID }  from "../../src/ckb/ckplanet.js"
import { postData } from '../../src/ckb/data_server.js'

DATA_STRUCT



let data_types = []
let access_token_public = '0x0354abd4f62e5e1ed2abdbc71cbb55fb0132e12ffbc25882733a79ca578a96b85bc51d43e03fed161db8ac6b23c3e03e7cbf0a43e98a316311f83f89eff2959f'
let access_token_private = '0xeb09ff23121575f3cd27a397923e7a7bad37b7fc7b394ab0417b3f06b82c9dd60c0aff13088931c385b965d8f1c86777fbc2ccb96fdbace6039396294d4e4767'

let access_token_items = {
    access_token_public,
    access_token_private,
    access_token_public_pk:'',
    access_token_private_pk:'',
}

data_types = [
    { key: 'user_profile', nth: 0 },
    { key: 'user_managed_cycle_list', nth: 0 },
    { key: 'user_joined_cycle_list', nth: 0 },
    { key: 'cycle_profile', nth: 0 },
    { key: 'cycle_users_list', nth: 0 },
    { key: 'cycle_tokens_list', nth: 0 },
    { key: 'cycle_contents',nth:0}
  ]

let dummy_data = [
    { key: 'user_profile', data: {imgUrl:'',} },
    { key: 'user_managed_cycle_list', data: [{access_token:"as"}] },
    { key: 'user_joined_cycle_list', data: [{access_token:"as"}] },
    { key: 'cycle_profile', data: ["xxx"] },
    { key: 'cycle_users_list', data: {u:"user"} },
    { key: 'cycle_tokens_list', data: ['sdsd'] },
    { key: 'cycle_contents',data:[]}
]

let data_ids = [
    { key: 'user_profile', id: "1" },
    { key: 'user_managed_cycle_list', id: "2" },
    { key: 'user_joined_cycle_list', id: "3" },
    { key: 'cycle_profile', cycleid: "12",id:"4:12" },
    { key: 'cycle_users_list', cycleid: "12",id:"6:12" },
    { key: 'cycle_tokens_list',  cycleid: "12",id:"7:12"},
    { key: 'cycle_contents', cycleid: "12",id:"5:12"}
  ]


describe("Ckplanet data process ",function(){

    describe("getDataID()",function(){
        data_ids.forEach(function(data){
            it(data.key+" should equal",function(){
                return expect(getDataID(data.key,data.cycleid)).to.equal(data.id)
            })
        })
    })

    describe("getDataTemplate()",function(){
        data_types.forEach(function(data_type){
            it("should diffent with raw",function(){
                let tmp = getDataTemplate(data_type.key)
                let raw = DATA_STRUCT[data_type.key]
                if (typeof(tmp) ==="object"){
                    tmp["xxzz"] = 0
                    return expect(raw).to.not.have.own.property("xxzz")
                }
                else{
                    tmp = "aaa"
                    return expect(raw).to.not.equal(tmp)
                }
            })
        })
    })

    describe("vaildDataType()",function(){
        dummy_data.forEach(function(data){
            it("dummy data should not pass",function(){
                return expect(vaildDataType(data.key,data.data)).to.equal(false)
            })
        })


        data_types.forEach(function(data_type){
            it("template data should pass",function(){
                let tmp = getDataTemplate(data_type.key)
                return expect(vaildDataType(data_type.key,tmp)).to.equal(true)
            })
            
        })
    })
    describe("getUrl()", function(){

        data_ids.forEach(function(data_type){
            describe("args are "+ data_type.key,function(){
                it('should got enough lenth',function(){
                return expect(getUrls(data_type.key,access_token_items,"12","public")).to.have.lengthOf(64)
                })
                it("should same as server created",async function(){
                    
                    let {url} = await postData('',data_type.id,'',access_token_public)
                    expect(getUrls(data_type.key,access_token_items,"12","public")).to.be.equal(url)
                    
                } )
            })
        })
    })
})


