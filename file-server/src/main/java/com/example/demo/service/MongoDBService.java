package com.example.demo.service;

import com.example.demo.entity.UploadRequestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

@Component
public class MongoDBService {

    @Autowired
    private MongoTemplate mongoTemplate;


    public void saveData(UploadRequestEntity upload) {
        mongoTemplate.save(upload);
    }

    public UploadRequestEntity findUserByDataId(String dataId) {
        Query query = new Query(Criteria.where("url").is(dataId));
        UploadRequestEntity entity = mongoTemplate.findOne(query, UploadRequestEntity.class);
        return entity;
    }

    public UploadRequestEntity findUserByUrl(String url) {
        Query query = new Query(Criteria.where("url").is(url));
        UploadRequestEntity entity = mongoTemplate.findOne(query, UploadRequestEntity.class);
        return entity;
    }

    public void deleteDataByUrl(String url) {
        Query query = new Query(Criteria.where("url").is(url));
        mongoTemplate.remove(query, UploadRequestEntity.class);
    }

}
//    sudo docker run -t -i  -p 8888:8877 server http://ckplanet.beihanguni.cn:8114/rpc  --spring.data.mongodb.uri=mongodb://172.17.0.1:27018/user   /bin/bash