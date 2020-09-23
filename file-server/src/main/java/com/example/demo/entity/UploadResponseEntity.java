package com.example.demo.entity;

/**
 * @author yunfeiyanggzq
 */
public class UploadResponseEntity {
    public int code;
    public String url;
    public String state;
    public String ticket;

    public UploadResponseEntity(int status) {
        code = status;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    @Override
    public String toString() {
        return "UploadResponseEntity{" +
                "url='" + url + '\'' +
                ", state='" + state + '\'' +
                ", ticket='" + ticket + '\'' +
                '}';
    }
}
