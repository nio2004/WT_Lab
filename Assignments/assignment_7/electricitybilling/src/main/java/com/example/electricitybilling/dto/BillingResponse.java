package com.example.electricitybilling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BillingResponse {
    private Long billId;
    private Long consumerId;
    private String consumerName;
    private Integer unitsConsumed;
    private BigDecimal billAmount;
    private String billingDate;
}