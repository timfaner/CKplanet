//这是运行在node.js上的
const WebSocket = require('ws');

PORT = process.argv[2]

console.log("Starting server on port "+ PORT)

const wss = new WebSocket.Server({
    port:PORT,
},
    ()=>{
        console.log("ws server created")
    })


let online=0;//存储在线人数
let ms={};


let receive_msg = {
    methods:'',
    params:[],
    to:'',
}

let send_msg = {
    methods:'',
    params:[],
    from:'',
}

let apply = {
    from:"",
    to:"",
    cycle_id:"",
    lock_args:""
}

let approval = {
    from:"",
    to:"",
    cycle_id:"",
    lock_args:"",
    result:false
}


function get_approval(){
    return JSON.parse(JSON.stringify(approval))
}
function get_apply(){
    return JSON.parse(JSON.stringify(apply))
}

function get_send_msg(){
    return JSON.parse(JSON.stringify(send_msg))
}

let users={};//存储连接用户

let approvals = []
let applys = []

function isEquivalent(a, b) {

    return JSON.stringify(a) === JSON.stringify(b)
}


/**
 * 
 * @param {*} msg  msg of join_cycle 
 * @param {*} applyer 
 */

function add_applys(msg,applyer){
    console.debug("adding applys")
    let apply = get_apply()
    apply.from = applyer
    apply.to = msg.to
    apply.lock_args = msg.params[0]
    apply.cycle_id = msg.params[1]
    applys.push(apply)
}


function delete_applys(apply){
    console.debug("deleting applys")
    let index=-1
    for(let i = 0;i<applys.length;i++){
        if(isEquivalent(apply,applys[i])){
            index = i
            break
        }
    }
    if (index > -1){
        applys.splice(index,1)
        delete_applys(apply)
    }
}

function find_applys(user){
    let tmp = []
    for(ap of applys){
        if(ap.to === user)
            tmp.push(ap)
    }
    return tmp
}

function send_applys(aps,ws){

    for(ap of aps){
        let msg = get_send_msg()
        msg.methods = "new_apply"
        msg.from = ap.from
        msg.params[0] = ap.lock_args
        msg.params[1] = ap.cycle_id
        try {
            ws.send(JSON.stringify(msg))
        } catch (error) {
            console.error(error)
        }
    }
}


function add_approval(msg,approvaler){
    console.log("adding approval",msg)
    let approval = get_approval()
    approval.from = approvaler
    approval.to = msg.to
    approval.lock_args = msg.params[0]
    approval.cycle_id = msg.params[1]
    approval.result = msg.params[2]
    approvals.push(approval)
}

function find_approvals(user){
    let tmp = []
    for(ar of approvals){
        if(ar.to === user)
            tmp.push(ar)
    }
    return tmp
}

function send_approvals(ars,ws){
    for(ar of ars){
        let msg = get_send_msg()
        msg.methods = "new_approval"
        msg.from = ar.from
        msg.params[0] = ar.lock_args
        msg.params[1] = ar.cycle_id
        msg.params[2] = ar.result


        try {
            ws.send(JSON.stringify(msg))
            finish_apply(ar)
        } catch (error) {
            console.error(error)
        }
    }
}
/**
 * delete  apply which corresponding approval comes 
 * @param {*} approval 
 */
function finish_apply(approval){


    let apply = get_apply()
    apply.from = approval.to
    apply.to = approval.from
    apply.lock_args = approval.lock_args
    apply.cycle_id = approval.cycle_id
    delete_applys(apply)

}
 

wss.on('connection',function(ws,req){

    user = req.headers["sec-websocket-protocol"]
    console.log("New connection from ",user);

    users[user] = ws

    let aps = find_applys(user)
    send_applys(aps,ws)

    let ars = find_approvals(user)
    send_approvals(ars,ws)

    
    ws.on('message',function(msg){
        user = req.headers["sec-websocket-protocol"]
        msg = JSON.parse(msg)
        console.log('reveive methods of ', msg.methods);
        switch (msg.methods) {
            case 'join_cycle':
                add_applys(msg,user)
                user_to_send = msg.to

                if(user_to_send in users){
                    console.log("sending apply to " + user_to_send)
                    let data = get_send_msg()
                    data.methods= "new_apply"
                    data.params =  msg.params
                    data.from = user
                    users[user_to_send].send(JSON.stringify(data))
                }

                break;
            case 'approval_resualt':
                

                user_to_send = msg.to
                if(user_to_send in users){
                    console.log("sending approval to " + user_to_send)
                    let data = get_send_msg()
                    data.methods = "new_approval"
                    data.params = msg.params
                    data.from = user



                    try {
                        users[user_to_send].send(JSON.stringify(data))
                        let ar = get_approval()
                        ar.from = user
                        ar.to = user_to_send
                        ar.lock_args = msg.params[0]
                        ar.cycle_id = msg.params[1]
                        ar.result = msg.params[2]
                        finish_apply(ar)
                    } catch (error) {
                        console.error(error)
                    }
                    
                }
                else{
                    add_approval(msg,user) //A little different from apply, we don't need to cache approval if we already sent approval notify.
                }
                break;

        
            default:
                console.error("Invalid methods",msg)
                break;
        }
    })

    ws.on('close',function(msg){
        user = req.headers["sec-websocket-protocol"]
        console.log("用户退出登录",user)
        delete users[user]
    })
})


/*

from_client

{methods: "join_cycle",
to:"0x1212",    //the cycle owners lock_args
params: ["0x1212","asdf"] //lock_args,cycle_id of cycle
}   //send this to lock_args using new new_apply

{methods: "approval_resualt"
to:"0x3434"  // address of apply sender
params: ["0x1212","asdf",true] //lock_args,cycle_id,results
}    //send this to `to` using new new_approval




to_client

{methods: "new_apply"
from: "0x3434"
params: ["0x1212","asdf"] //lock_args,cycle_id
}


{methods: "new_approval"
from:"0x1212" //the cycle owners lock_args
params: ["0x1212","asdf",true] //lock_args,cycle_id,results of cycle
}

*/