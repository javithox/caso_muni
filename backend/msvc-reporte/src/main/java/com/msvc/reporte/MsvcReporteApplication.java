package com.msvc.reporte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsvcReporteApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsvcReporteApplication.class, args);
    }

}
