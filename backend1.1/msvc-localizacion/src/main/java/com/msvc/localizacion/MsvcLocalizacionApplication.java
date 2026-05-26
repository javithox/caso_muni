package com.msvc.localizacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsvcLocalizacionApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsvcLocalizacionApplication.class, args);
    }

}
