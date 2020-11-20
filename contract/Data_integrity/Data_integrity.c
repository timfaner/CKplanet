
#include <string.h>
#include <ctype.h>
#include "ckb_syscalls.h"
#include "molecule_builder.h"
#include "molecule_reader.h"
#include "protocol.h"

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

//用于分割字符串，通过传入的const char字符
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

int main()
{
    
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

    // cell data
    uint64_t len = 1024;
    size_t index = 0;
    unsigned char buffer[1024];

    ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT);

    char outputs[2][512];//data_hash & hash_sig
    split(outputs,buffer,",");
    if(memcmp(outputs[0],"{\"data_hash\":", 13) !=0 || \
         memcmp(outputs[1],"\"data_hash_sig\":",15)!=0 ){
        return PREFIX_ERROR;//数据前缀格式有问题
    }
    int ret1 = ishex(outputs[0]+14, 0);
    int ret2 = ishex(outputs[1]+17, 1);
    if(ret1<0||ret2<0){
        return HEX_REEOR;
    }

    return 0;
}