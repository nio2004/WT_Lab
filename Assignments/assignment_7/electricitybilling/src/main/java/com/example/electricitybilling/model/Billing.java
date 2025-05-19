package com.example.electricitybilling.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "billing")
@Data
@NoArgsConstructor
public class Billing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "consumer_id", nullable = false)
    private Long consumerId;
    
    @Column(name = "units_consumed", nullable = false)
    private Integer unitsConsumed;
    
    @Column(name = "bill_amount", nullable = false)
    private BigDecimal billAmount;
    
    @Column(name = "billing_date")
    private LocalDateTime billingDate = LocalDateTime.now();
}