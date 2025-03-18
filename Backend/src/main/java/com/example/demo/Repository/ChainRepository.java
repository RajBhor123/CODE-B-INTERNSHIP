package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Chain;
import com.example.demo.Entity.Group;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChainRepository extends JpaRepository<Chain, Long> {
    Optional<Chain> findByGstnNo(String gstnNo);
    List<Chain> findByGroup(Group group);
    List<Chain> findByIsActiveTrue();
    List<Chain> findByGroupAndIsActiveTrue(Group group);
    boolean existsByChainId(Long chainId);
}