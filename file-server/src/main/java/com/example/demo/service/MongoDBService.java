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
        Query query = new Query(Criteria.where("dataId").is(dataId));
        UploadRequestEntity entity = mongoTemplate.findOne(query, UploadRequestEntity.class);
        return entity;
    }

    public UploadRequestEntity findUserByUrl(String dataId) {
        Query query = new Query(Criteria.where("url").is(dataId));
        UploadRequestEntity entity = mongoTemplate.findOne(query, UploadRequestEntity.class);
        return entity;
    }

//    /**
//     * 更新对象
//     * @param user
//     */
//    public long updateUser(UploadRequestEntity entity) {
//        Query query=new Query(Criteria.where("dataId").is(entity.getDataId()));
//        Update update= new Update().set("dataId", entity.g).set("passWord", user.getPassWord());
//        //更新查询返回结果集的第一条
//        UpdateResult result =mongoTemplate.updateFirst(query,update,User.class);
//        //更新查询返回结果集的所有
//        // mongoTemplate.updateMulti(query,update,UserEntity.class);
//        if(result!=null)
//            return result.getMatchedCount();
//        else
//            return 0;
//    }


    public void deleteDataById(String dataId) {
        Query query = new Query(Criteria.where("dataId").is(dataId));
        mongoTemplate.remove(query, UploadRequestEntity.class);
    }

}