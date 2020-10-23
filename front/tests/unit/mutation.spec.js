import { expect } from "chai"
import  ckplanet  from "../../src/store/ckplanet.js"

console.log(ckplanet)
const {updateCyclesPool} = ckplanet.mutations

const state = {cycles_pool:{}}


const lock_args = [
    "12",
    "13",
    "14"]

const cycle_ids = [
    "1",
    "3",
    "123"
]


const cycle_profiles = [{
    cycle_name:'efw',
    introduction:'gew',
    avatar_url:'wfw',
    type:'wef' //enmu, open|close
},
{
    cycle_name:'efdsw',
    introduction:'ggdew',
    avatar_url:'wfsdw',
    type:'wedsff' //enmu, open|close
},
{
    cycle_name:'',
    introduction:'',
    avatar_url:'',
    type:'' //enmu, open|close
},
    ]

let updateCyclesPool_testcase = [
    {args:[
        lock_args[0],
        cycle_ids[0],
        {cycle_profile:cycle_profiles[0]}],
    result:{
        [lock_args[0]]:{
            [cycle_ids[0]]:{
                cycle_profile:cycle_profiles[0],
                aes_key:'',
                joined_status: "",
                user_lists:[],
                contents:{

                },
                contents_list:[]    
            }
        }
    }
    },

    {args:[
        lock_args[0],
        cycle_ids[0],
        {aes_key:"biubl"}],
    result:{
        [lock_args[0]]:{
            [cycle_ids[0]]:{
                cycle_profile:cycle_profiles[0],
                aes_key:'biubl',
                joined_status: "",
                user_lists:[],
                contents:{

                },
                contents_list:[]
            }
    }}},
    {args:[
        lock_args[1],
        cycle_ids[0],
        {aes_key:"biubll"}],
    result:{
        [lock_args[0]]:{
            [cycle_ids[0]]:{
                cycle_profile:cycle_profiles[0],
                aes_key:'biubl',
                joined_status: "",
                user_lists:[],
                contents:{

                },
                contents_list:[]
            }
    },
    [lock_args[1]]:{
        [cycle_ids[0]]:{
            cycle_profile:cycle_profiles[2],
            aes_key:'biubll',
            joined_status: "",
            user_lists:[],
            contents:{

            },
            contents_list:[]
            }
        } 
    }
    },
    {args:[
        lock_args[1],
        cycle_ids[1],
        {aes_key:"biubl"}],
    result:{
        [lock_args[0]]:{
            [cycle_ids[0]]:{
                cycle_profile:cycle_profiles[0],
                aes_key:'biubl',
                joined_status: "",
                user_lists:[],
                contents:{

                },
                contents_list:[]
            }
    },
    [lock_args[1]]:{
        [cycle_ids[0]]:{
            cycle_profile:cycle_profiles[2],
            aes_key:'biubll',
            joined_status: "",
            user_lists:[],
            contents:{

            },
            contents_list:[]
            },
        [cycle_ids[1]]:{
            cycle_profile:cycle_profiles[2],
            aes_key:'biubl',
            joined_status: "",
            user_lists:[],
            contents:{

            },
            contents_list:[]
            }
        }
    }
    },
    {args:[
        lock_args[1],
        cycle_ids[1],
        {aes_key:"bababa",cycle_profile:cycle_profiles[0]}],
    result:{
        [lock_args[0]]:{
            [cycle_ids[0]]:{
                cycle_profile:cycle_profiles[0],
                aes_key:'biubl',
                joined_status: "",
                user_lists:[],
                contents:{

                },
                contents_list:[]
            }
    },
    [lock_args[1]]:{
        [cycle_ids[0]]:{
            cycle_profile:cycle_profiles[2],
            aes_key:'biubll',
            joined_status: "",
            user_lists:[],
            contents:{

            },
            contents_list:[]
            },
        [cycle_ids[1]]:{
            cycle_profile:cycle_profiles[0],
            aes_key:'bababa',
            joined_status: "",
            user_lists:[],
            contents:{

            },
            contents_list:[]
            }
        }
    }
    },
    
]

let updateCyclePool_testcase_dummy = [
    {args:{
        lock_args:lock_args[0],
        cycle_id:cycle_ids[0],
        cycle_props:{
            cycle_profiles:cycle_profiles[0]} //多了个s
    },
    result:"Invaild cycle_props"
    },
    {args:[
    ],
    result:"Lack of args " + undefined + ' ; ' + undefined + ' ; ' + undefined
    },

]

describe('mutations',function(){


    updateCyclesPool_testcase.forEach(function(test){
        it(' updateCyclesPool should equal state',function(){
            updateCyclesPool(state,
                {lock_args:test.args[0],
                cycle_id:test.args[1],
                cycle_props:test.args[2]})
            expect(state.cycles_pool).to.deep.equal(test.result)
        })
    })

    updateCyclePool_testcase_dummy.forEach(function(test){
        it(' updateCyclesPool should throw error',function(){
            expect( () => updateCyclesPool(state,{...test.args})).to.throw(test.result)
        })
    })


})