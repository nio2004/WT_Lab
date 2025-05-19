package com.example.electricitybilling.dto;

import lombok.Data;

@Data
public class BillingRequest {
    private Long consumerId;
    private Integer units;
}