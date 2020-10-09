const ckplanet = {
    state :() => ({

//TODO 存放各大类数据的缓存列表，数据分为上链类不上链类管理 （某些更新是原子的，思考如何保证）
        user_info:{
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
        }
    },
    actions:{
        getUserProfile({state,commit,rootState}){
            commit,state,rootState
        }
    },

}


export default  ckplanet