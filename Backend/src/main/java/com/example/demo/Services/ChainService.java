package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Chain;
import com.example.demo.Entity.Group;
import com.example.demo.Repository.BrandRepository;
import com.example.demo.Repository.ChainRepository;
import com.example.demo.Repository.GroupRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChainService {

    @Autowired
    private ChainRepository chainRepository;
    
    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private BrandRepository brandRepository;

    public List<Chain> getAllChains() {
        return chainRepository.findByIsActiveTrue();
    }
    
    public List<Chain> getChainsByGroup(Long groupId) {
        Optional<Group> group = groupRepository.findById(groupId);
        if (group.isPresent()) {
            return chainRepository.findByGroupAndIsActiveTrue(group.get());
        }
        throw new RuntimeException("Group not found");
    }

    public Optional<Chain> getChainById(Long chainId) {
        return chainRepository.findById(chainId);
    }

    public Chain addChain(Chain chain, Long groupId) {
        // Validate GSTN uniqueness
        if (chainRepository.findByGstnNo(chain.getGstnNo()).isPresent()) {
            throw new RuntimeException("GSTN number already exists");
        }
        
        // Find and set the group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        chain.setGroup(group);
        
        // Set timestamps
        chain.setCreatedAt(LocalDateTime.now());
        chain.setUpdatedAt(LocalDateTime.now());
        
        return chainRepository.save(chain);
    }

    public Chain updateChain(Long chainId, Chain updatedChain, Long groupId) {
        Chain existingChain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
        
        // Check if the updated GSTN belongs to another chain
        Optional<Chain> chainWithSameGstn = chainRepository.findByGstnNo(updatedChain.getGstnNo());
        if (chainWithSameGstn.isPresent() && !chainWithSameGstn.get().getChainId().equals(chainId)) {
            throw new RuntimeException("GSTN number already exists for another company");
        }
        
        // Find and set the group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Update chain details
        existingChain.setCompanyName(updatedChain.getCompanyName());
        existingChain.setGstnNo(updatedChain.getGstnNo());
        existingChain.setGroup(group);
        existingChain.setUpdatedAt(LocalDateTime.now());
        
        return chainRepository.save(existingChain);
    }

    public void deleteChain(Long chainId) {
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
        
        // Check if the chain has any associated brands
        if (brandRepository.existsByChain(chain)) {
            throw new RuntimeException("Cannot delete chain as it is associated with brands");
        }
        
        // Soft delete the chain
        chain.setActive(false);
        chain.setUpdatedAt(LocalDateTime.now());
        chainRepository.save(chain);
    }
    
    public boolean canDeleteChain(Long chainId) {
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
        
        return !brandRepository.existsByChain(chain);
    }
    
    public long getChainCount() {
        return chainRepository.findByIsActiveTrue().size();
    }
}