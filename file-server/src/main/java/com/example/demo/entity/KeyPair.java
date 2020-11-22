package com.example.demo.entity;

/**
 * @author yunfeiyanggzq
 */
public class KeyPair {
    public String pri;
    public String pub;

    public String getPri() {
        return pri;
    }

    public void setPri(String pri) {
        this.pri = pri;
    }

    public String getPub() {
        return pub;
    }

    public void setPub(String pub) {
        this.pub = pub;
    }

    @Override
    public String toString() {
        return "KeyPair{" +
                "pri='" + pri + '\'' +
                ", pub='" + pub + '\'' +
                '}';
    }
}
