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
import com.example.demo.entity.*;

import com.example.demo.service.AuthenticationService;
import com.example.demo.service.MongoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Eric Zhao
 */
@RestController
public class FileServerController {
    static final int NOT_EXIST = 2;
    static final int EXIST = 1;
    static final int SUCCESS = 0;
    static final int AUTHORIZED = 3;
    static final int UNAUTHORIZED = 4;
    static final int FAILED = 5;


    @Autowired
    private MongoDBService mongoDBService;

    //{"sig":"d940effaf9693993ba8c715f7233c1cc619e727dc86724605abe12dd96188937fa853f1f11ff1adcf3c7e476d88eb0217965dda065d280cfb357c7d08b776ec0","data":{"name":"yunfeiyang","attr":"handsome"},"dataId":"999","cert":"73b9bc1acc68b6e4426642590b38304fd8792d8ddb4cf845b6ec01c0b563a886e33633ac19516976e9d53f609b84ae118bc2386e76111322809d6cd4be09190c","pk":"0301d26b2e0514c0f40a6ec03e3e07ad0fc95104889c7e3c049503eacaafb6e3b6","accessToken":"ee4cd72091807f96c28c1a015db2aecd402bc5147c16964ede75abd360bd6bb0389420907dd02d4938a77afc659d919b72142459858e6e454ad942a1ce826038"}
    @PostMapping("/upload")
    public UploadResponseEntity upload(String request) {
        try {
            UploadRequestEntity entity = JSONObject.parseObject(request, UploadRequestEntity.class);
            System.out.println("上传" + entity.toString());
            String mpk = AuthenticationService.generatePublicKey();
            String msg = entity.getPk() + entity.getAccessToken();
            if (!AuthenticationService.verify(entity.getCert(), msg, mpk)) {
                System.out.println("1");
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (!AuthenticationService.verify(entity.getSig(), entity.getData().toString(), entity.getPk())) {
                System.out.println("2");
                return new UploadResponseEntity(UNAUTHORIZED);
            }
            if (mongoDBService.findUserByDataId(entity.getDataId()) != null) {
                return new UploadResponseEntity(EXIST);
            }
            String s = (entity.getDataId() + entity.getAccessToken());
            entity.setUrl(String.valueOf(s.hashCode()));
            mongoDBService.saveData(entity);
            UploadResponseEntity response = new UploadResponseEntity(SUCCESS);
            response.setUrl(entity.getUrl());
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new UploadResponseEntity(FAILED);

        }

    }

    //  {"msg":"hello ckPlant","accessToken":"ee4cd72091807f96c28c1a015db2aecd402bc5147c16964ede75abd360bd6bb0389420907dd02d4938a77afc659d919b72142459858e6e454ad942a1ce826038","cpk":"03a34c143c95c71ba648b174bc1fdc489fee1423e9713e19a7a13bb03d21b438e0"}
    @GetMapping("/download")
    public DownloadResponseEntity download(String url) {
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

    @PostMapping("/authorize")
    public AuthResponseEntity auth(String request) {
        try {
            AuthRequestEntity entity = JSONObject.parseObject(request, AuthRequestEntity.class);
            if (!AuthenticationService.verify(entity.getAccessToken(), entity.getMsg(), entity.getCpk())) {
                return new AuthResponseEntity(UNAUTHORIZED);
            }
            KeyPair keyPair = AuthenticationService.generateKeyPair();
            AuthResponseEntity responseEntity = new AuthResponseEntity(SUCCESS);
            responseEntity.setPk(keyPair.getPub());
            responseEntity.setSk(keyPair.getPri());
            String cert = AuthenticationService.sign(AuthenticationService.getMsk(), (keyPair.getPub() + entity.getAccessToken()));
            responseEntity.setCert(cert);
            return responseEntity;
        } catch (Exception e) {
            e.printStackTrace();
            return new AuthResponseEntity(FAILED);
        }

    }
}
