#include <memory.h>
#include <string.h>
#include "ckb_syscalls.h"

/* 默认是字符串类型 
现在的规则是在相应的字段后面添加数据
输入的时候进行判断，并检测其安全性
args: data_id
output_data：
data_hash:
data_hash_sig:
*/

int main(int argc, char* argv[]) {
  int ret;
  size_t index = 0;
  uint64_t len = 0;
  unsigned char buffer[1024];

  ckb_debug("This is a data integrity for ckplanet");

  // 你可以使用多个cell来存储你的数据，不仅限于数据完整性存储
  // 但是第一个的data字段必须放置你的更新数据
  while (1) {
    len = 1024;
    memset(buffer, 0, 1024);
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



