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
import com.example.demo.entity.DownloadResponseEntity;
import com.example.demo.entity.UploadRequestEntity;
import com.example.demo.entity.UploadResponseEntity;
import com.example.demo.service.MongoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.*;
import java.security.spec.ECGenParameterSpec;

/**
 * @author Eric Zhao
 */
@RestController
public class ClusterDemoController {
    static final int NOT_EXIST = 2;
    static final int EXIST = 1;
    static final int SUCCESS = 0;

    @Autowired
    private MongoDBService mongoDBService;

    @PostMapping("/upload")
    public UploadResponseEntity upload(String request) {
        UploadRequestEntity entity = JSONObject.parseObject(request, UploadRequestEntity.class);
        if (mongoDBService.findUserByDataId(entity.getDataId()) != null) {
            return new UploadResponseEntity(EXIST);
        }
        String s = (entity.getDataId() + entity.getAccessToken());
        entity.setUrl(String.valueOf(s.hashCode()));
        mongoDBService.saveData(entity);
        UploadResponseEntity response = new UploadResponseEntity(SUCCESS);
        response.setUrl(entity.getUrl());
        return response;
    }


    @GetMapping("/download")
    public DownloadResponseEntity download(String url) {
        DownloadResponseEntity response = new DownloadResponseEntity();
        UploadRequestEntity entity = mongoDBService.findUserByUrl(url);
        if (entity == null) {
            response.setCode(NOT_EXIST);
            return response;
        }
        response.setData(entity.toString());
        response.setCode(SUCCESS);
        return response;
    }

    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidAlgorithmParameterException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("EC");
        // curveName这里取值：secp256k1
        ECGenParameterSpec ecGenParameterSpec = new ECGenParameterSpec("secp256k1");
        keyPairGenerator.initialize(ecGenParameterSpec, new SecureRandom());
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        // 获取公钥
        PublicKey pub = keyPair.getPublic();
        // 获取私钥
        PrivateKey pre = keyPair.getPrivate();
        System.out.println(pub.toString());
        System.out.println(pre.toString());

        
    }
}
