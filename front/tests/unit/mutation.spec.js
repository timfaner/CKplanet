import { expect } from "chai"
import  ckplanet  from "../../src/store/ckplanet.js"

console.log(ckplanet)
const {updateCyclesPool} = ckplanet.mutations

const state = {cycles_pool:{}}


const access_tokens = [
    "12",
    "13",
    "14"]

const cycle_ids = [
    "1",
    "3",
    "123"
]



let updateCyclesPool_testcast = [
    {args:[
        access_tokens[0],
        cycle_ids[0],
        {cycle_profiles:"blbl"}],
    result:{
        [access_tokens[0]]:{
            [cycle_ids[0]]:{
                cycle_profiles:"blbl"
            }
        }
    }
    },

    {args:[
        access_tokens[0],
        cycle_ids[0],
        {aes_key:"biubl"}],
    result:{
        [access_tokens[0]]:{
            [cycle_ids[0]]:{
                cycle_profiles:"blbl",
                aes_key:"biubl"
            }
        }
    }
    },
    {args:[
        access_tokens[1],
        cycle_ids[0],
        {aes_key:"biubl"}],
    result:{
        [access_tokens[0]]:{
            [cycle_ids[0]]:{
                cycle_profiles:"blbl",
                aes_key:"biubl"
            }
        },
        [access_tokens[1]]:{
            [cycle_ids[0]]:{
                aes_key:"biubl"
            }
        }
    }
    },
    {args:[
        access_tokens[1],
        cycle_ids[1],
        {aes_key:"biubl"}],
    result:{
        [access_tokens[0]]:{
            [cycle_ids[0]]:{
                cycle_profiles:"blbl",
                aes_key:"biubl"
            }
        },
        [access_tokens[1]]:{
            [cycle_ids[0]]:{
                aes_key:"biubl"
            },
            [cycle_ids[1]]:{
                aes_key:"biubl"
            }
        }
    }
    },
    {args:[
        access_tokens[1],
        cycle_ids[1],
        {aes_key:"bababa",cycle_profiles:"tatata"}],
    result:{
        [access_tokens[0]]:{
            [cycle_ids[0]]:{
                cycle_profiles:"blbl",
                aes_key:"biubl"
            }
        },
        [access_tokens[1]]:{
            [cycle_ids[0]]:{
                aes_key:"biubl"
            },
            [cycle_ids[1]]:{
                aes_key:"bababa",
                cycle_profiles:"tatata"
            }
        }
    }
    },
    
]

describe('mutations',function(){


    updateCyclesPool_testcast.forEach(function(test){
        it(' updateCyclesPool should equal state',function(){
            updateCyclesPool(state,
                {access_token:test.args[0],
                cycle_id:test.args[1],
                cycle_props:test.args[2]})
            expect(state.cycles_pool).to.deep.equal(test.result)
        })
    })


})