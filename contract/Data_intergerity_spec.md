### Data_intergerity

###args:

 - data_intergerity 的 `args` 为id, 每个id对应一个元数据。  
 
 - id 由data_id , cycle_id , content_id 拼接而成，中间用 `冒号`链接。各个字段均为**ascii字符**.   

字段名称 | 字段长度 | 是否必须有 |示例
-------|--------|:----:|-----
data_id | 1~3 |  是|12 、 dv 、 1D
cycle_id | 4 | 否| aUfc 、 EdwS
contetn_id | 6 | 否，如果有则必须有cycle_id 字段|arLdgr、 Efssef
id | 1~15 | 是|12:wefE:sfwSfv 、 12:EdwS 、 12
 

 