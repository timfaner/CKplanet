package com.example.demo.entity;

import com.alibaba.fastjson.JSONObject;

/**
 * @author yunfeiyanggzq
 */

public class UploadRequestEntity {
    public String data_id;
    public String access_token;
    public String data;
    public String sig;
    public String tx_id;
    public String pk;
    public String cert;
    public String url;
    public String data_hash;

    public UploadRequestEntity(){
    }
    public UploadRequestEntity(String dataId, String accessToken, String data, String sig, String txId, String pk, String cert, String url, String dataHash) {
        this.data_id = dataId;
        this.access_token = accessToken;
        this.data = data;
        this.sig = sig;
        this.tx_id = txId;
        this.pk = pk;
        this.cert = cert;
        this.url = url;
        this.data_hash = dataHash;
    }

    public UploadRequestEntity(String data_id, String accessToken, String data, String sig, String pk, String cert) {
        this.data_id = data_id;
        this.access_token = accessToken;
        this.data = data;
        this.sig = sig;
        this.pk = pk.substring(2);
        this.cert = cert;
    }

    public String getData_hash() {
        return data_hash;
    }

    public void setData_hash(String data_hash) {
        this.data_hash = data_hash;
    }

    @Override
    public String toString() {
        return "UploadRequestEntity{" +
                "data_id='" + data_id + '\'' +
                ", access_token='" + access_token + '\'' +
                ", data=" + data +
                ", sig='" + sig + '\'' +
                ", tx_id='" + tx_id + '\'' +
                ", pk='" + pk + '\'' +
                ", cert='" + cert + '\'' +
                ", url='" + url + '\'' +
                '}';
    }

    public String getPk() {
        return pk;
    }

    public void setPk(String pk) {
        this.pk = pk;
    }

    public String getCert() {
        return cert;
    }

    public void setCert(String cert) {
        this.cert = cert;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDataId() {
        return data_id;
    }

    public void setDataId(String dataId) {
        this.data_id = dataId;
    }

    public String getAccessToken() {
        return access_token;
    }

    public void setAccessToken(String accessToken) {
        this.access_token = accessToken;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getSig() {
        return sig;
    }

    public void setSig(String sig) {
        this.sig = sig;
    }

    public String getTxId() {
        return tx_id;
    }

    public void setTxId(String txId) {
        this.tx_id = txId;
    }

}
