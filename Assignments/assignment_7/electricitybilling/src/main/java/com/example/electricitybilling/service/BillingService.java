package com.example.electricitybilling.service;

import com.example.electricitybilling.dto.BillingRequest;
import com.example.electricitybilling.dto.BillingResponse;
import com.example.electricitybilling.model.Billing;
import com.example.electricitybilling.model.Consumer;
import com.example.electricitybilling.repository.BillingRepository;
import com.example.electricitybilling.repository.ConsumerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillingService {
    
    private final BillingRepository billingRepository;
    private final ConsumerRepository consumerRepository;
    
    @Autowired
    public BillingService(BillingRepository billingRepository, ConsumerRepository consumerRepository) {
        this.billingRepository = billingRepository;
        this.consumerRepository = consumerRepository;
    }
    
    public BigDecimal calculateBill(int units) {
        double amount = 0;
        
        if (units <= 50) {
            amount = units * 3.50;
        } else if (units <= 150) {
            amount = 50 * 3.50 + (units - 50) * 4.00;
        } else if (units <= 250) {
            amount = 50 * 3.50 + 100 * 4.00 + (units - 150) * 5.20;
        } else {
            amount = 50 * 3.50 + 100 * 4.00 + 100 * 5.20 + (units - 250) * 6.50;
        }
        
        return BigDecimal.valueOf(amount);
    }
    
    public BillingResponse calculateAndSaveBill(BillingRequest request) {
        Consumer consumer = consumerRepository.findById(request.getConsumerId())
                .orElseThrow(() -> new RuntimeException("Consumer not found"));
        
        BigDecimal billAmount = calculateBill(request.getUnits());
        
        Billing billing = new Billing();
        billing.setConsumerId(consumer.getId());
        billing.setUnitsConsumed(request.getUnits());
        billing.setBillAmount(billAmount);
        
        billing = billingRepository.save(billing);
        
        return createBillingResponse(billing, consumer.getName());
    }
    
    public List<BillingResponse> getBillHistory(Long consumerId) {
        Consumer consumer = consumerRepository.findById(consumerId)
                .orElseThrow(() -> new RuntimeException("Consumer not found"));
        
        List<Billing> billings = billingRepository.findByConsumerIdOrderByBillingDateDesc(consumerId);
        
        return billings.stream()
                .map(billing -> createBillingResponse(billing, consumer.getName()))
                .collect(Collectors.toList());
    }
    
    private BillingResponse createBillingResponse(Billing billing, String consumerName) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        return new BillingResponse(
                billing.getId(),
                billing.getConsumerId(),
                consumerName,
                billing.getUnitsConsumed(),
                billing.getBillAmount(),
                billing.getBillingDate().format(formatter)
        );
    }
}