package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Chain;
import com.example.demo.Services.ChainService;
import com.example.demo.Services.GroupService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chains")
@CrossOrigin(origins = "*")
public class ChainController {

    @Autowired
    private ChainService chainService;
    
    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<Chain> getAllChains() {
        return chainService.getAllChains();
    }
    
    @GetMapping("/group/{groupId}")
    public List<Chain> getChainsByGroup(@PathVariable Long groupId) {
        return chainService.getChainsByGroup(groupId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChainById(@PathVariable Long id) {
        return chainService.getChainById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createChain(@RequestBody Chain chain, @RequestParam Long groupId) {
        try {
            Chain newChain = chainService.addChain(chain, groupId);
            return ResponseEntity.ok(newChain);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateChain(@PathVariable Long id, @RequestBody Chain chain, @RequestParam Long groupId) {
        try {
            Chain updatedChain = chainService.updateChain(id, chain, groupId);
            return ResponseEntity.ok(updatedChain);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChain(@PathVariable Long id) {
        try {
            chainService.deleteChain(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/can-delete/{id}")
    public ResponseEntity<Boolean> canDeleteChain(@PathVariable Long id) {
        return ResponseEntity.ok(chainService.canDeleteChain(id));
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getChainCount() {
        return ResponseEntity.ok(chainService.getChainCount());
    }
}