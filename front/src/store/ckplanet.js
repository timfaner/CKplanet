const ckplanet = {
    state :() => ({
        
        wallet_connected:false,
        data_server_connected:false,

        
        user_profile:{
            nick_name:'测试',
            avatar_url:'https://placekitten.com/400/400',
            data_encrypted_key:'', // 加密数据用
        },
        
    }),
    mutations:{
        updateUserInfo(state,payload){
            if ("data_encrypted_key" in payload){
                state.user_info.data_encrypted_key = payload.data_encrypted_key
            }
            else if ( "nick_name" in payload && "avatar_url" in payload){
                state.user_info.nick_name = payload.nick_name
                state.user_info.avatar_url = payload.avatar_url
            }   
        },
        walletConnect(state,s=false){
            state.wallet_connected = s
        },
        dataServerConnect(state,s=false){
            state.data_server_connected = s
        }
    },
    actions:{
        getUserProfile({state,commit,rootState}){
            commit,state,rootState
        }
    },

}


export default  ckplanet