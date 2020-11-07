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

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.example.demo.entity.*;
import com.example.demo.service.AuthenticationService;
import com.example.demo.service.MongoDBService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
//import org.bouncycastle.jcajce.provider.digest.Blake2b;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;
import org.omg.CORBA.PUBLIC_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Security;
import java.util.ArrayList;


@RestController
public class FileServerController {
    static final int NOT_EXIST = 2;
    static final int EXIST = 1;
    static final int SUCCESS = 0;
    static final int AUTHORIZED = 3;
    static final int UNAUTHORIZED = 4;
    static final int FAILED = 5;
//    @Value("${rpcAddress}")
    static  final public String rpc="http://ckplanet.beihanguni.cn:8114/rpc";

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
            String url = AuthenticationService.SHA(s, "SHA-256");
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
    public String validTransaction(String txId, String d, String dataHash, int index) {
        System.out.println("进来了");
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
                System.out.println(result);
                JSONObject j=JSONObject.parseObject(result);
                System.out.println(j.toString(SerializerFeature.PrettyFormat));

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
        }
        return null;
    }


    public static void main(String[] args) {
        final Blake2b hash = Blake2b.Digest.newInstance(24);
        if (nonce != null) {
            hash.update(nonce);
        }

        hash.update(clientKey);
        hash.update(serverKey);

    }

}


