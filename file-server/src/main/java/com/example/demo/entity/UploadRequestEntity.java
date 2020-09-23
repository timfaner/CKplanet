package com.example.demo.entity;

import com.alibaba.fastjson.JSONObject;

/**
 * @author yunfeiyanggzq
 */

public class UploadRequestEntity {
    public String dataId;
    public String accessToken;
    public JSONObject data;
    public String sig;
    public String txId;
    public String dataHash;
    public String url;

    @Override
    public String toString() {
        return "UploadRequestEntity{" +
                "dataId='" + dataId + '\'' +
                ", accessToken='" + accessToken + '\'' +
                ", data=" + data +
                ", sig='" + sig + '\'' +
                ", txId='" + txId + '\'' +
                ", dataHash='" + dataHash + '\'' +
                ", url='" + url + '\'' +
                '}';
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDataId() {
        return dataId;
    }

    public void setDataId(String dataId) {
        this.dataId = dataId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public JSONObject getData() {
        return data;
    }

    public void setData(JSONObject data) {
        this.data = data;
    }

    public String getSig() {
        return sig;
    }

    public void setSig(String sig) {
        this.sig = sig;
    }

    public String getTxId() {
        return txId;
    }

    public void setTxId(String txId) {
        this.txId = txId;
    }

    public String getDataHash() {
        return dataHash;
    }

    public void setDataHash(String dataHash) {
        this.dataHash = dataHash;
    }

}
