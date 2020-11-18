
#include <memory.h>
#include <string.h>
#include <ctype.h>
#include "ckb_syscalls.h"

/*
args:"12"$outputsData:{data_hash:"0x1234",data_hash_sig:"0x1212"}
*/

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

int ishex(char *hexstr, int index)
{
	int i;
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


int main(int argc, char* argv[]) {
  int ret;
  uint64_t len = 1024;
  char buffer[1024];
  //char buffer[1024] = "args:\"12\"$outputsData:{data_hash:\"0x1234\",data_hash_sig:\"0x1212\"}";

  char args_data[2][512];//spilt args & data
  char outputs[2][512];//data hash & hash sig


  ret = ckb_load_cell_data(buffer, &len, 0, 0, CKB_SOURCE_OUTPUT);
  if (ret == CKB_INDEX_OUT_OF_BOUND) {
    return -1;
  } 

  // args | outputdata
  split(args_data, buffer, "$");
  // judge the args format
  if (memcmp(args_data[0], "args:", 5) != 0) {
    return -1;
  }

  // outputsData:{data_hash:"0x1234",data_hash_sig:"0x1212"}
  split(outputs,args_data[1],",");
  if(memcmp(outputs[0],"outputsData:", 12) !=0 || \
      memcmp(outputs[0]+13,"data_hash:\"0x",13) !=0 || \
          memcmp(outputs[1],"data_hash_sig:\"0x",17) !=0){
    return -2;
  }
  
  int ret1 = ishex(outputs[0]+26, 0);
  int ret2 = ishex(outputs[1]+19, 1);
  if(ret1<0||ret2<0){
    return -3;
  }
  return 0;


}




