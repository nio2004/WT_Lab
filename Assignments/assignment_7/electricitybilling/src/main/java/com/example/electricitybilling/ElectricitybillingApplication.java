package com.example.electricitybilling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example.electricitybilling.model")
@EnableJpaRepositories("com.example.electricitybilling.repository")
public class ElectricitybillingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElectricitybillingApplication.class, args);
    }
}