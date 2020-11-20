
#include <memory.h>
#include <string.h>
#include <ctype.h>
//#include <regex>
#include "ckb_syscalls.h"
#include "molecule_builder.h"
#include "molecule_reader.h"
#include "protocol.h"
//using namespace std;

#define SCRIPT_SIZE 32768
#define PREFIX_ERROR -1
#define URL_ERROR -2
#define HEX_REEOR -3
#define ERROR_SYSCALL -5
#define ERROR_SCRIPT_TOO_LONG -6
// Common error codes that might be returned by the script.
#define BLAKE2B_BLOCK_SIZE 32
#define SCRIPT_SIZE 32768

// Common error codes that might be returned by the script.
#define ERROR_ARGUMENTS_LEN -8
#define ERROR_ENCODING -7


/*
{"dataserver_ip":"http://ckplanet.beihanguni.cn:8081,http://ckplanet.beihanguni.cn:8080","access_token_public":"0xd8","access_token_public_pk":"0x038"}
 */

//用于分割字符串，通过传入的const char字符
// outputs[0] == dataserver_ip
// outputs[1] == access_token_public
// outputs[2] == access_token_public_pk
int split(char dst[][512], char* str, const char* spl)
{
    int n = 0;
    char *result = NULL;
    result = strtok(str, spl);
    while( result != NULL )
    {
        strcpy(dst[n++], result);
        result = strtok(NULL, spl);
    }
    return n;
}

//判断字符串是否为16进制
int ishex(char *hexstr, int index)
{
    int i;
    if(memcmp(hexstr,"0x",2) != 0) return -1;
    hexstr = &hexstr[3];
    if (index == 0){
        for (i=0;i<strlen(hexstr)-1;i++){
            if(isxdigit(hexstr[i]) == 0){
                return -1;
            }
        }
    }
    if (index == 1){
        for (i=0;i<strlen(hexstr)-2;i++){
            if(isxdigit(hexstr[i]) == 0){
                return -1;
            }
        }
    }
    return 1;
}

// {"dataserver_ip":"https://;http://"
// 通过正则表达式判断
// 太艹了正则也不能用
/*
int check_ip_fuuuuck(char *str){
    //通过则进入判断
    const char *pattern = "^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\\:[0-9]+)*(/($|[a-zA-Z0-9\\.\\,\\?\\'\\\\\\+&amp;%\\$#\\=~_\\-]+))*$";
    int cflags = REG_EXTENDED;
    int status;
    regmatch_t pmatch[1];
    size_t nmatch;
    regex_t reg;
    regcomp(&reg,pattern,cflags);
    status = regexec(&reg,str,nmatch,pmatch,0);
    if(status == 0){
        return 1;
    } else{
        return 0;
    }

}
*/


int check_ip(char* str){
//    const char *pattern = "^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\\:[0-9]+)*(/($|[a-zA-Z0-9\\.\\,\\?\\'\\\\\\+&amp;%\\$#\\=~_\\-]+))*$";
//    int ret = regex_match(str, regex(pattern));
//    return ret;
    if(memcmp(str,"http://",7)==0 || memcmp(str,"https://",8)==0){
        for(int i = 7;i<strlen(str);i++){
            //判断端口号为数字
            if (str[i] == ':'){
                for(int j = i+1;j<strlen(str);j++){
                    if(str[j]-'0'>9||str[j]-'0'<0){
                        return 0;
                    }
                }
            }
        }
        return 1;
    } else{
        return 0;
    }
}

int cut_ip(char *ip_str){
    char *all_ip = strchr(ip_str,':');
    //过滤前后 "
    all_ip = &all_ip[2];
    all_ip[strlen(all_ip)-1] = '\0';
    int index = 0,count = 0;
    char* ip1;
    char* ip2;
    for (int i = 0;i<strlen(all_ip);i++){
        if (all_ip[i] == ';') {
            all_ip[i] = '\0';
            index = i;
            count++;
        }
    }
    // ckb_exit(-4);
    if(count>1) return -4;//服务器ip地址个数超出限制
    //判断ip域名格式是否正确
    if(count>0) {
        ip1 = all_ip;
        ip2 = &all_ip[index]+1;
        return (check_ip(ip1)&&check_ip(ip2));
    } else{
        ip1 = all_ip;
        return check_ip(ip1);
    }


}

int main(int argc, char* argv[]) {

    // script ///////////////
    unsigned char script[SCRIPT_SIZE];
    uint64_t len_sp = SCRIPT_SIZE;
    int ret_sp = ckb_load_script(script, &len_sp, 0);
    if (ret_sp != CKB_SUCCESS) {
        return ERROR_SYSCALL;
    }
    if (len_sp > SCRIPT_SIZE) {
        return ERROR_SCRIPT_TOO_LONG;
    }
    // script ///////////////
    mol_seg_t script_seg;
    script_seg.ptr = (uint8_t *)script;
    script_seg.size = len_sp;
    if (MolReader_Script_verify(&script_seg, false) != MOL_OK) {
        return ERROR_ENCODING;
    }

    mol_seg_t args_seg = MolReader_Script_get_args(&script_seg);

    if(args_seg.size == 0){
        return ERROR_ARGUMENTS_LEN;
    }
    mol_seg_t args_bytes_seg = MolReader_Bytes_raw_bytes(&args_seg);

    if (args_bytes_seg.size == 0) {
        return ERROR_ARGUMENTS_LEN;
    }


    int ret;
    uint64_t len = 1024;
    size_t index = 0;
    unsigned char buffer[1024];
    char outputs[3][512];//token & token pk & ip

 

    //char buffer[1024] = "{\"dataserver_ip\":\"http://ckplanet.beihanguni.cn:8081;https://ckplanet.beihanguni.cn:8080\",\"access_token_public\":\"0xAAACC38\",\"access_token_public_pk\":\"0x038\"}";
    ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT);
    
    //outputdata
    split(outputs,buffer,",");
    if(memcmp(outputs[0],"{\"dataserver_ip\":", 17) !=0 || \
         memcmp(outputs[1],"\"access_token_public\":",21)!=0 ||\
            memcmp(outputs[2],"\"access_token_public_pk\":",25) !=0 ){
        return PREFIX_ERROR;//数据前缀格式有问题
    }

    //解析ip并判断是否符合规则
    if(!cut_ip(outputs[0])) { return URL_ERROR;}

    int ret1 = ishex(outputs[1]+23, 0);
    int ret2 = ishex(outputs[2]+26, 1);
    if(ret1<0||ret2<0){
        return HEX_REEOR;//16进制字符串格式 error
    }
    return 0;

}




