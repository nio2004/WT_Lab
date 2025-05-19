package com.example.electricitybilling.repository;

import com.example.electricitybilling.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
    List<Billing> findByConsumerIdOrderByBillingDateDesc(Long consumerId);
}