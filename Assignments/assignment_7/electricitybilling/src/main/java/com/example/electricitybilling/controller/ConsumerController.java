package com.example.electricitybilling.controller;

import com.example.electricitybilling.model.Consumer;
import com.example.electricitybilling.repository.ConsumerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consumers")
@CrossOrigin(origins = "*")
public class ConsumerController {
    
    private final ConsumerRepository consumerRepository;
    
    @Autowired
    public ConsumerController(ConsumerRepository consumerRepository) {
        this.consumerRepository = consumerRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Consumer>> getAllConsumers() {
        return ResponseEntity.ok(consumerRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Consumer> getConsumerById(@PathVariable Long id) {
        return consumerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Consumer> createConsumer(@RequestBody Consumer consumer) {
        return ResponseEntity.ok(consumerRepository.save(consumer));
    }
}