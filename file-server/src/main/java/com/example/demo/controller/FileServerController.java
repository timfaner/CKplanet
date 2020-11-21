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
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.example.demo.entity.*;
import com.example.demo.service.AuthenticationService;
import com.example.demo.service.MongoDBService;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.security.Security;
import java.util.ArrayList;
import java.util.logging.Logger;


@RestController
public class FileServerController {
    static final int NOT_EXIST = 2;
    static final int EXIST = 1;
    static final int SUCCESS = 0;
    static final int AUTHORIZED = 3;
    static final int UNAUTHORIZED = 4;
    static final int FAILED = 5;
    static final String NOT_FOUND = "NOT_FOUND";
    static final String PENDING_ = "PENDING";
    static final String SUCCESS_ = "SUCCESS";
    static final String FAIL_ = "FAIL";

    static public String rpc = "";

    final Logger log4js = Logger.getLogger(FileServerController.class.toString());

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static void setRpcAddress(String address) {
        rpc = address;
    }

    public static String getRpcAddress() {
        return rpc;
    }

    @Autowired
    private MongoDBService mongoDBService;

    @PostMapping("/v2/getMpk")
    public JSONObject getMPK() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("mpk", AuthenticationService.generatePublicKey());
        log4js.info("查询mpk成功" + jsonObject.get("mpk"));
        return jsonObject;
    }

    @PostMapping("/v2/postData")
    public UploadResponseEntity postDataV2(@RequestBody JSONObject jsonObject) {
        try {
            String sig = jsonObject.getString("sig");
            String data = jsonObject.getString("data");
            String dataId = jsonObject.getString("data_id");
            String cert = jsonObject.getString("cert");
            String pk = jsonObject.getString("pk");
            String accessToken = jsonObject.getString("access_token");
            String txId = jsonObject.getString("tx_id");

            Blake2b h = new Blake2b();
            h.update(data.getBytes());
            String dataHash = h.doFinalString();
            if (SUCCESS_ != validTransaction(txId, dataHash)) {
                log4js.warning("验证是否上链结果为失败，拒绝上传数据");
                return new UploadResponseEntity(FAILED);
            }

            UploadRequestEntity entity = new UploadRequestEntity(dataId, accessToken, data, sig, pk, cert);
            String mpk = AuthenticationService.generatePublicKey();
            String msg = entity.getPk() + entity.getAccessToken();
            if (!AuthenticationService.verify(entity.getCert(), msg, mpk)) {
                log4js.warning("验证证书结果为失败，拒绝上传数据,证书为：" + entity.getCert() + "msg为：" + msg + "mpk为：" + mpk);
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (!AuthenticationService.verify(entity.getSig(), data, entity.getPk())) {
                log4js.warning("验证签名结果为失败，拒绝上传数据,签名为：" + entity.getSig() + "data为：" + data + "pk为：" + entity.getPk());
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (mongoDBService.findUserByDataId(entity.getDataId()) != null) {
                log4js.warning("dataId已经存在，删除原有数据，dataId:" + entity.getDataId());
                mongoDBService.deleteDataById(entity.getDataId());
            }
            String s = (entity.getAccessToken() + entity.getDataId());
            Blake2b hash = new Blake2b();
            hash.update(s.getBytes());
            String url = hash.doFinalString();
            entity.setUrl(url);
            mongoDBService.saveData(entity);
            UploadResponseEntity response = new UploadResponseEntity(SUCCESS);
            response.setUrl(entity.getUrl());
            log4js.warning("上传数据成功");
            return response;
        } catch (Exception e) {
            log4js.warning("上传数据失败");
            e.printStackTrace();
            return new UploadResponseEntity(FAILED);
        }

    }


    @PostMapping("/v2/postDataWithoutVerify")
    public UploadResponseEntity postDataWithoutVerifyV2(@RequestBody JSONObject jsonObject) {
        try {
            String sig = jsonObject.getString("sig");
            String data = jsonObject.getString("data");
            String dataId = jsonObject.getString("data_id");
            String cert = jsonObject.getString("cert");
            String pk = jsonObject.getString("pk");
            String accessToken = jsonObject.getString("access_token");
            String txId = jsonObject.getString("tx_id");


            UploadRequestEntity entity = new UploadRequestEntity(dataId, accessToken, data, sig, pk, cert);
            String mpk = AuthenticationService.generatePublicKey();
            String msg = entity.getPk() + entity.getAccessToken();
            if (!AuthenticationService.verify(entity.getCert(), msg, mpk)) {
                log4js.warning("验证证书结果为失败，拒绝上传数据,证书为：" + entity.getCert() + "msg为：" + msg + "mpk为：" + mpk);
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (!AuthenticationService.verify(entity.getSig(), data, entity.getPk())) {
                log4js.warning("验证签名结果为失败，拒绝上传数据,签名为：" + entity.getSig() + "data为：" + data + "pk为：" + entity.getPk());
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (mongoDBService.findUserByDataId(entity.getDataId()) != null) {
                log4js.warning("dataId已经存在，删除原有数据，dataId:" + entity.getDataId());
                mongoDBService.deleteDataById(entity.getDataId());
            }
            String s = (entity.getAccessToken() + entity.getDataId());
            Blake2b hash = new Blake2b();
            hash.update(s.getBytes());
            String url = hash.doFinalString();
            entity.setUrl(url);
            mongoDBService.saveData(entity);
            UploadResponseEntity response = new UploadResponseEntity(SUCCESS);
            response.setUrl(entity.getUrl());
            log4js.warning("上传数据成功");
            return response;
        } catch (Exception e) {
            log4js.warning("上传数据失败");
            e.printStackTrace();
            return new UploadResponseEntity(FAILED);
        }

    }

    @PostMapping("/v2/getData")
    public DownloadResponseEntity getDataV2(@RequestBody JSONObject jsonObject, HttpServletResponse res) {
        try {
            String url = jsonObject.getString("url");
            log4js.warning("获取data，url为" + url);
            DownloadResponseEntity response = new DownloadResponseEntity(SUCCESS);
            UploadRequestEntity entity = mongoDBService.findUserByUrl(url);
            if (entity == null) {
                log4js.warning("获取data失败，查询结果为空");
                response.setCode(NOT_EXIST);
                return response;
            }
            response.setData(entity.getData());
            response.setCode(SUCCESS);
            log4js.warning("获取data成功");
            return response;
        } catch (Exception e) {
            log4js.warning("获取data失败");
            e.printStackTrace();
            return new DownloadResponseEntity(FAILED);
        }
    }

    @PostMapping("/v2/getAuth")
    public AuthResponseEntity getAuthV2(@RequestBody JSONObject jsonObject, HttpServletResponse response) {
        try {
            String accessToken = jsonObject.getString("access_token");
            String msg = jsonObject.getString("msg");
            String cpk = jsonObject.getString("cpk");
            String type = jsonObject.getString("type");
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
            log4js.warning("认证成功");
            return responseEntity;
        } catch (Exception e) {
            log4js.warning("认证失败");
            e.printStackTrace();
            return new AuthResponseEntity(FAILED);
        }
    }


    @PostMapping("/v2/valid")
    public JSONObject validTransactionV2(@RequestBody JSONObject jsonObject, HttpServletResponse response) {
        String txId = jsonObject.getString("txId");
        String hash = jsonObject.getString("hash");
        JSONObject result = new JSONObject();
        result.put("result", validTransaction(txId, hash));
        return result;
    }

    public String validTransaction(String txId, String hash) {
        try {
            CloseableHttpClient client = null;
            CloseableHttpResponse response = null;
            try {
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
                if (result == null || result.equals("")) {
                    log4js.warning("未找到交易");
                    return NOT_FOUND;
                }

                JSONObject j = JSONObject.parseObject(result);
                JSONObject resultJson = JSONObject.parseObject(j.get("result").toString());
                JSONObject transactionJson = JSONObject.parseObject(resultJson.get("transaction").toString());
                JSONArray outputDatas = (JSONArray) transactionJson.get("outputs_data");

                for (int i = 0; i < outputDatas.size(); i++) {
                    String hex = (String) outputDatas.get(i);
                    if (hex.length() <= 2) {
                        log4js.warning("无效hex" + hex + ",抛弃");
                        continue;
                    }
                    byte[] hexSubstring = Hex.decode(hex.substring(2));
                    String decodeString = new String(hexSubstring, "UTF-8");
                    String decodeHash = (String) JSONObject.parseObject(decodeString).get("data_hash");
                    log4js.warning("解码得到的hash：" + decodeHash + "传入的hash：" + hash);
                    if (decodeHash.equals(hash)) {
                        log4js.warning("验证成功");
                        return SUCCESS_;
                    }
                }
                log4js.warning("验证失败");
                return FAIL_;
            } finally {
                if (response != null) {
                    response.close();
                }
                if (client != null) {
                    client.close();
                }
            }
        } catch (Exception e) {
            log4js.warning("未找到交易");
            e.printStackTrace();
            return NOT_FOUND;
        }
    }
}



