package com.example.demo.entity;

/**
 * @author yunfeiyanggzq
 */
public class AuthRequestEntity {
    public String accessToken;
    public String msg;
    public String cpk;

    public AuthRequestEntity(String accessToken, String msg, String cpk) {
        this.accessToken = accessToken;
        this.msg = msg;
        int len=cpk.length();
        this.cpk = cpk.substring(2,len);
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getCpk() {
        return cpk;
    }

    public void setCpk(String cpk) {
        this.cpk = cpk;
    }

    @Override
    public String toString() {
        return "AuthRequestEntity{" +
                "accessToken:'" + accessToken + '\'' +
                ", msg:'" + msg + '\'' +
                ", cpk:'" + cpk + '\'' +
                '}';
    }
}
