package com.example.electricitybilling.controller;

import com.example.electricitybilling.dto.BillingRequest;
import com.example.electricitybilling.dto.BillingResponse;
import com.example.electricitybilling.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {
    
    private final BillingService billingService;
    
    @Autowired
    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }
    
    @PostMapping("/calculate")
    public ResponseEntity<BigDecimal> calculateBill(@RequestParam int units) {
        return ResponseEntity.ok(billingService.calculateBill(units));
    }
    
    @PostMapping
    public ResponseEntity<BillingResponse> generateBill(@RequestBody BillingRequest request) {
        return ResponseEntity.ok(billingService.calculateAndSaveBill(request));
    }
    
    @GetMapping("/history/{consumerId}")
    public ResponseEntity<List<BillingResponse>> getBillHistory(@PathVariable Long consumerId) {
        return ResponseEntity.ok(billingService.getBillHistory(consumerId));
    }
}