package com.msvc.reporte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableFeignClients
public class MsvcReporteApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsvcReporteApplication.class, args);
    }
    
    /**
     * Bean de RestTemplate para llamadas HTTP externas (Google Maps API, etc.)
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
