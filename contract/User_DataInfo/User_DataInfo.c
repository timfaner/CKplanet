#include <memory.h>
#include <string.h>
#include "ckb_syscalls.h"

/* 默认是字符串类型 
现在的规则是在相应的字段后面添加数据
合约实现的关键：输入的时候进行判断，并检测其安全性
args: app_id (由dapp自己定，对长度有个限制）
output_data
dataserver_ip : 判断ip地址的规则
access_token_public : 
access_token_public_pk: 需要确定密钥长度，按照16进制字符串进行存储
                        不考虑16进制的大整数，尽量将合约轻量化实现
*/


/*
int check_intput(char* str)
{
  char* pch;
  // 选定一个特殊字符进行切割
  char *delim = "?";
  pch = strtok(str, "\n");
  while (pch != NULL)
  {
      pch = strtok(NULL, "\n");
      // 不同的字段有不同的检测规则
      // switch-case{}/if-else{}
  }

  return 0;
}
*/


int main(int argc, char* argv[]) {
  int ret;
  size_t index = 0;
  uint64_t len = 0;

  unsigned char buffer[2048];

  //ckb_debug("This is a user data info for ckplanet");

  // 你可以使用多个cell来存储你的数据，不仅限于数据完整性存储
  // 但是第一个的data字段必须放置你的更新数据
  while (1) {
    len = 2048;
    memset(buffer, 0, 2048);
    ret = ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT);
    if (ret == CKB_INDEX_OUT_OF_BOUND) {
      break;
    } 
    // 对输入的数据buffer进行判断处理
    ckb_debug(buffer);
    // 待测试完善规则
    //check_intput(buffer);
    index++;
  }
    
  //return num;
  return 0;
}




