package com.example.demo;

import com.example.demo.controller.FileServerController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(exclude= DataSourceAutoConfiguration.class)
public class CkplantApplication  {

    public static void main(String[] args) {
        if(args.length!=1){
            System.out.println("必须传入rpc地址,rpc地址为空");
        }
        FileServerController.setRpcAddress(args[0]);
        System.out.println("rpc地址为："+FileServerController.getRpcAddress());
        SpringApplication.run(CkplantApplication.class, args);
    }
}
