
import  {postData,getData} from "./data_server"




postData,getData

const DATA_TYPE = {
    user_profile:"1",
    user_managed_cycle_list:"2",
    user_joined_cycle_list:"3",
    cycle_profile:(cycleid) =>{return "4:"+ cycleid},
    cycle_contents:(cycleid) =>{return "5:"+ cycleid},
    cycle_users:(cycleid) => {return "6:" + cycleid}
}
 

export  {DATA_TYPE,

}