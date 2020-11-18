package com.example.demo.entity;

/**
 * @author yunfeiyanggzq
 */
public class AuthResponseEntity {
    public int code;
    public String pk;
    public String sk;
    public String cert;

    public AuthResponseEntity(int code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "AuthResponseEntity{" +
                "code=" + code +
                ", pk='" + pk + '\'' +
                ", sk='" + sk + '\'' +
                ", cert='" + cert + '\'' +
                '}';
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getPk() {
        return pk;
    }

    public void setPk(String pk) {
        this.pk = pk;
    }

    public String getSk() {
        return sk;
    }

    public void setSk(String sk) {
        this.sk = sk;
    }

    public String getCert() {
        return cert;
    }

    public void setCert(String cert) {
        this.cert = cert;
    }

}
