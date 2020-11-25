import {WS_SERVER_URL} from "@/ckb/const"

let receive_msg = {
    methods:'',
    params:[],
    from:'',
}

let send_msg = {
    methods:'',
    params:[],
    to:'',
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

function reconnectWs(ws){
    return  connect_ws_server(
        ws.protocol,
        ws.onmessage,
        ws.onclose,
        ws.onerror
    )

}
function sendWsMsg(msg){
    if(window.ws){
       try {
        if (window.ws.readyState===3 )
            window.ws = reconnectWs(window.ws)
        window.ws.send(JSON.stringify(msg))
       } catch (error) {
           console.error('[sendWsMsg] ',error)
       } 
    }
    else
        console.error("[sendWsMsg] ws not connected")
}

function sendApply({from,to,lock_args,cycle_id}){
    let msg = getSendMsg()
    msg.to = to
    msg.methods = "join_cycle"
    msg.params[0] = lock_args
    msg.params[1] = cycle_id
    console.debug(`[sendApply] Apply from ${from} to ${to} , want join ${lock_args}:${cycle_id}`)
    sendWsMsg(msg)
}

function sendApproval({from,to,lock_args,cycle_id,result}){
    let msg = getSendMsg()
    msg.to = to
    msg.methods = "approval_resualt"
    msg.params[0] = lock_args
    msg.params[1] = cycle_id
    msg.params[2] = result
    console.debug(`[sendApproval] Approval from ${from} to ${to} ,   ${lock_args}:${cycle_id} with resualt ${result}`)
    sendWsMsg(msg)
}

function getApproval(){
    return JSON.parse(JSON.stringify(approval))
}
function getApply(){
    return JSON.parse(JSON.stringify(apply))
}

function getSendMsg(){
    return JSON.parse(JSON.stringify(send_msg))
}



/**
 * 
 * @param {*} store 
 */
function get_onmessage(store){
    return (evt) => {
        store
        let rec = JSON.parse(evt.data)
        
        if(rec.methods === "new_apply" || rec.methods === "new_approval")
            console.debug(`[WS receive] ${rec.methods}`)
        else{
            console.error(`[WS receive] Invalid methos ${rec.methods}`)
            return
        }
        switch (rec.methods) {
            case "new_apply":{
                let apply = getApply()
                apply.from = rec.from
                apply.to = store.state.user_chain_info.lock_args
                apply.lock_args = rec.params[0]
                apply.cycle_id = rec.params[1]
                if(apply.to !== apply.lock_args){
                    console.error("[WS receive] Invalid apply, to and lock_args not equal. ",apply)
                    return
                }
                store.commit(
                    "addJoinApply",
                    apply
                )
                break;}
            case "new_approval":{
                let approval = getApproval()
                approval.from = rec.from
                approval.to = store.state.user_chain_info.lock_args

                approval.lock_args = rec.params[0]
                approval.cycle_id = rec.params[1]
                approval.result = rec.params[2]
                if(approval.from !== approval.lock_args){
                    console.error("[WS receive] Invalid apply, from and lock_args not equal. ",approval)
                    return
                }
                store.commit(
                    "addJoinApproval",
                    approval
                )
                break;
            }
                
            default:
                console.error("[WS receive] Invalid methods : "+ rec.methods)
                break;
        }

    }
}

function get_onerror(){
    return (error) =>{
        console.error("WS error",error)
    }
}

function get_onclose(){
    return ()=>{
        console.log("WS closed")
    }
}
function connect_ws_server(lock_args,onmessage,onclose,onerror){
    if(lock_args){
        try {
            let ws = new WebSocket(WS_SERVER_URL,lock_args)
            ws.onopen = ()=>{
                console.debug("[connect_ws_server] Ws open, lock_args is : "+lock_args)
            }
            ws.onmessage = onmessage
            ws.onclose = onclose 
            ws.onerror = onerror
            return ws
        } catch (error) {
            console.error(error)
        }
    }
}

export {
    receive_msg,
    send_msg,
    getApproval,
    getApply,
    getSendMsg,
    connect_ws_server,
    get_onmessage,get_onerror,get_onclose,
    sendApply,
    sendApproval
}


