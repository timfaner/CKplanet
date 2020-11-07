/*
 * Copyright 1999-2018 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.demo.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.example.demo.entity.*;
import com.example.demo.service.AuthenticationService;
import com.example.demo.service.MongoDBService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;
import org.nervos.ckb.crypto.Blake2b;
import org.nervos.ckb.utils.Numeric;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.util.ArrayList;

//import org.bouncycastle.jcajce.provider.digest.Blake2b;


@RestController
public class FileServerController {
    static final int NOT_EXIST = 2;
    static final int EXIST = 1;
    static final int SUCCESS = 0;
    static final int AUTHORIZED = 3;
    static final int UNAUTHORIZED = 4;
    static final int FAILED = 5;
    static final int NOT_FOUND=-1;
    static final int PENDING=0;
    static final int SUCCESS_=1;
    static final int FAIL_=2;


    //    @Value("${rpcAddress}")
    static final public String rpc = "http://ckplanet.beihanguni.cn:8114/rpc";

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    @Autowired
    private MongoDBService mongoDBService;

    @PostMapping("/getMpk")
    public String getMPK() {
        return AuthenticationService.generatePublicKey();
    }

    @PostMapping("/postData")
    public UploadResponseEntity postData(String sig, String data, String dataId, String cert, String pk, String accessToken) {
        try {
            UploadRequestEntity entity = new UploadRequestEntity(dataId, accessToken, JSONObject.parseObject(data), sig, pk, cert);
            String mpk = AuthenticationService.generatePublicKey();
            String msg = entity.getPk() + entity.getAccessToken();
            if (!AuthenticationService.verify(entity.getCert(), msg, mpk)) {
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (!AuthenticationService.verify(entity.getSig(), entity.getData().toString(), entity.getPk())) {
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (mongoDBService.findUserByDataId(entity.getDataId()) != null) {
                mongoDBService.deleteDataById(entity.getDataId());
            }
            String s = (entity.getDataId() + entity.getAccessToken());
            Blake2b hash=new Blake2b();
            hash.update(s.getBytes());
            System.out.println("url"+hash.doFinalString());
            String url =hash.doFinalString();
            entity.setUrl(url);
            mongoDBService.saveData(entity);
            UploadResponseEntity response = new UploadResponseEntity(SUCCESS);
            response.setUrl(entity.getUrl());
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new UploadResponseEntity(FAILED);

        }

    }

    @PostMapping("/getData")
    public DownloadResponseEntity getData(String url) {
        try {
            DownloadResponseEntity response = new DownloadResponseEntity(SUCCESS);
            UploadRequestEntity entity = mongoDBService.findUserByUrl(url);
            if (entity == null) {
                response.setCode(NOT_EXIST);
                return response;
            }
            response.setData(entity.toString());
            response.setCode(SUCCESS);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new DownloadResponseEntity(FAILED);
        }

    }

    @PostMapping("/getAuth")
    public AuthResponseEntity getAuth(String accessToken, String msg, String cpk) {
        try {
            AuthRequestEntity entity = new AuthRequestEntity(accessToken, msg, cpk);
            if (!AuthenticationService.verify(entity.getAccessToken(), entity.msg, entity.getCpk())) {
                return new AuthResponseEntity(UNAUTHORIZED);
            }
            KeyPair keyPair = AuthenticationService.generateKeyPair();
            AuthResponseEntity responseEntity = new AuthResponseEntity(SUCCESS);
            responseEntity.setPk("0x" + keyPair.getPub());
            responseEntity.setSk("0x" + keyPair.getPri());
            String cert = AuthenticationService.sign(AuthenticationService.getMsk(), (keyPair.getPub() + entity.getAccessToken()));
            responseEntity.setCert(cert);
            return responseEntity;
        } catch (Exception e) {
            e.printStackTrace();
            return new AuthResponseEntity(FAILED);
        }
    }

    @PostMapping("/valid")
    public int validTransaction(String txId, String raw, String hash, int index) {
        try {
            CloseableHttpClient client = null;
            CloseableHttpResponse response = null;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JSONObject data = new JSONObject();
                data.put("id", 42);
                data.put("jsonrpc", "2.0");
                data.put("method", "get_transaction");
                ArrayList<String> list = new ArrayList<String>();
                list.add(txId);
                data.put("params", list);
                HttpPost httpPost = new HttpPost(rpc);
                httpPost.setHeader(HTTP.CONTENT_TYPE, "application/json");
                httpPost.setEntity(new StringEntity(data.toString(SerializerFeature.PrettyFormat),
                        ContentType.create("text/json", "UTF-8")));
                client = HttpClients.createDefault();
                response = client.execute(httpPost);
                HttpEntity entity = response.getEntity();
                String result = EntityUtils.toString(entity);
                if(result==null||result.equals("")){
                    return NOT_FOUND;
                }

                JSONObject j = JSONObject.parseObject(result);
                JSONObject resultJson=JSONObject.parseObject(j.get("result").toString());
                JSONObject transactionJson=JSONObject.parseObject(resultJson.get("transaction").toString());
                JSONArray outputDatas=(JSONArray)transactionJson.get("outputs_data");
                if(index>=outputDatas.size()){
                    return NOT_FOUND;
                }
                String hex=(String)outputDatas.get(index);
                byte[] hexSubstring = Hex.decode(hex.substring(2));
                String decodeString=new String(hexSubstring, "UTF-8");
                String decodeHash=(String) JSONObject.parseObject(decodeString).get("data_hash");
                System.out.println("解码得到的hash："+decodeHash);
                System.out.println("传入的hash："+hash);
                if( decodeHash.equals(hash)){
                    return  SUCCESS_;
                }else{
                    return  FAIL_;
                }
            } finally {
                if (response != null) {
                    response.close();
                }
                if (client != null) {
                    client.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    public static void main(String[] args) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        Blake2b hash=new Blake2b();
        hash.update("hello world".getBytes());
        System.out.println(hash.doFinalString());

       String s= "0x7b22646174615f68617368223a22307862313866366539303664383632616539616238396131636164663861343263643264393838346631356331643930623536333466346138623662313132386335222c22646174615f686173685f736967223a2230783332643535303665303431383534613666383334396335623362613031373061313932303632313237633636626530333664393937623163333166393135376535316634316463663162326437353735643039323561323936326261666435616332353165623162376232366165646337353133316536646431333462333234227d";
//        Blake2b hash=new Blake2b();
//        hash.update("hello world".getBytes());
//        System.out.println(hash.doFinalString());
//
//        byte data[] = "A".getBytes("UTF-8");
//        byte[] encodeData = Hex.encode(data);
//        String encodeStr = Hex.toHexString(data);
//        System.out.println(new String(encodeData, "UTF-8"));
//        System.out.println(encodeStr);
        // 解码
//        byte[] decodeData = Hex.decode(s.getBytes());
        byte[] decodeData2 = Hex.decode(s.substring(2,s.length()));
//        System.out.println(new String(decodeData, "UTF-8"));
        System.out.println(new String(decodeData2, "UTF-8"));


    }
}



