package com.example.demo.entity;

/**
 * @author yunfeiyanggzq
 */
public class AuthRequestEntity {
    public String accessToken;
    public String msg;
    public String cpk;

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
