# The Contract Usage Documentation
## ERROR CODE
```
#define SCRIPT_SIZE 32768
#define PREFIX_ERROR -1
#define URL_ERROR -2
#define HEX_REEOR -3
#define ERROR_SYSCALL -5
#define ERROR_SCRIPT_TOO_LONG -6
#define ERROR_ARGUMENTS_LEN -8
#define ERROR_ENCODING -7
// Common error codes that might be returned by the script.
#define BLAKE2B_BLOCK_SIZE 32
#define SCRIPT_SIZE 32768
```

## Userdata_Info Contract
### Features
1. Check whether the value of each field in **output_data** conforms to the format
- **dataserver_ip** is the correct address: Protocol + Domain Name + Port Number , and the protocol is  `http://`or `https://`
- **access_token_public**  Check if it is a hexadecimal string and the prefix is `0x`
- **access_token_public_pk**  Check if it is a hexadecimal string and the prefix is `0x`

2. Check whether the Script field complies with the CKB specification

### Data args description
- The args of `dataserver_info` is `app_id`, and each app_id corresponds to an app that uses storage services
- app_id is **ascii character**

Field name | Field length (bytes) | Must have | Purpose | Example
:-------:|:--------:|:----:|:---------:|:-----:
app_id | 1-10 |  YES |  app ID |CKplanet, DeepChat

#### e.g.

- Data before encoding (data stored on the chain)
```
ckplanet
```

- Data after encoding

```
0x636b706c616e6574
```

### outputs_data
The data is a json format string, using utf-8 encoding, with the following fields:

- **dataserver_ip:** Protocol + Domain Name + Port Number 
- **access_token_public:** Hexadecimal string prefix is `0x`
- **access_token_public_pk:** Hexadecimal string prefix is `0x`


Field name | Field type | Must have | Usage | Example
:-------:|:--------:|:----:|:---------:|:-----:
dataserver_ip | string |  YES |  Data server access address | http://data_server.ckplanet.com:8181
access\_token\_public | string | YES | Public data access token | 0xcafebabe 
access\_token\_public\_pk | string | YES | access_token_public pub_key | 0xdeadbeef 

#### e.g.

- Data before encoding
```json
{"dataserver_ip":"http://ckplanet.beihanguni.cn:8081/http://ckplanet.beihanguni.cn:8080","access_token_public":"0xd8353e4d2ca95a5eef46d2d4d74ac5efca754a32cae54682f2f6923f7dc372bc1a9a6dd3fa9f720504c3cab1f7bcb86cba09f4a6cd0272752a6c55cfb27fba83","access_token_public_pk":"0x038dbc8452781346ffc0b170d12d89f5a5dcd89bcd783e2ac379eb01c511f3e409"}
```

- Data after encoding
```
0x7b22646174617365727665725f6970223a22687474703a2f2f636b706c616e65742e62656968616e67756e692e636e3a383038312f687474703a2f2f636b706c616e65742e62656968616e67756e692e636e3a38303830222c226163636573735f746f6b656e5f7075626c6963223a2230786438333533653464326361393561356565663436643264346437346163356566636137353461333263616535343638326632663639323366376463333732626331613961366464336661396637323035303463336361623166376263623836636261303966346136636430323732373532613663353563666232376662613833222c226163636573735f746f6b656e5f7075626c69635f706b223a223078303338646263383435323738313334366666633062313730643132643839663561356463643839626364373833653261633337396562303163353131663365343039227d
```

### e.g.
![img1](data_intergrity.png)

## Data_intergerity Contract
### Features

1. Check whether the value of each field in output_data conforms to the format
 
- **data_hash**  Check if it is a hexadecimal string and the prefix is `0x`
- **data_hash_sig**  Check if it is a hexadecimal string and the prefix is `0x`

2. Check whether the Script field complies with the CKB specification

###  Data args description

 - The `args` of data_intergerity is the data id, and each data id corresponds to a piece of data of the owner of `lock_script`.
 
 - **`ID`** is formed by concatenating data\_id, cycle\_id, content\_id with `:` link in the middle. All fields are **ascii characters**.

Field name | Field length (bytes) | Must have | Usage | Example
:-------:|:--------:|:----:|:---------:|:-----:
data_id | 1~3 |  YES | Type of data| 12,  dv, 1D 
cycle_id | 4 | NO | representative | aUfc,  EdwS
content_id | 6 | No, if yes, there must be a cycle_id field | NULL |arLdgr, Efssef
id | 1~15 | YES | NULL |12:wefE:sfwSfv , 12:EdwS, 12
 
#### e.g.

- Data before encoding  
```
1
```

- Data after encoding  

```
0x31
```

###  outputs_data

json format string, using utf-8 encoding, with the following fields:

- **data_hash:**  Hexadecimal string prefix is `0x`
- **data_hash_sig:** Hexadecimal string prefix is `0x`


Field name | Field type | Must have | Usage | Example
:-------:|:--------:|:----:|:---------:|:-----:
data_hash | string |  YES|  hash of id corresponding data |  0xcafebabe
data_hash_sig | string |YES | sig of data_hash | 0xdeadbeef 

#### e.g.

- Data before encoding
```json
{"data_hash":"0xcbc23263883fd3b2e803b34cf12791a9b3812edd6c7b545fdf5658642a0184b2","data_hash_sig":"0xba301ce860d626f776145c9e8b02a525f7e892d5b532a492705ad1c810b6e44a4ac3cc7cc423f73e1ea4313b5346956e8289c8515d5cee03724fdf57375f9253"}
```

- Data after encoding 
```
0x7b22646174615f68617368223a22307863626332333236333838336664336232653830336233346366313237393161396233383132656464366337623534356664663536353836343261303138346232222c22646174615f686173685f736967223a2230786261333031636538363064363236663737363134356339653862303261353235663765383932643562353332613439323730356164316338313062366534346134616333636337636334323366373365316561343331336235333436393536653832383963383531356435636565303337323466646635373337356639323533227d
```

### e.g.
![img1](data_intergrity.png)
