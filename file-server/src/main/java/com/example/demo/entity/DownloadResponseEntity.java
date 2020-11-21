package com.example.demo.entity;

/**
 * @author yunfeiyanggzq
 */
public class DownloadResponseEntity {
    public String data;
    public String proof;
    public int code;

    public DownloadResponseEntity(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String toString() {
        return "DownloadResponseEntity{" +
                "data='" + data + '\'' +
                ", proof='" + proof + '\'' +
                ", code=" + code +
                '}';
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getProof() {
        return proof;
    }

    public void setProof(String proof) {
        this.proof = proof;
    }

}
