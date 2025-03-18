package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Services.ChainService;
import com.example.demo.Services.GroupService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private GroupService groupService;
    
    @Autowired
    private ChainService chainService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalGroups", groupService.getGroupCount());
        stats.put("totalChains", chainService.getChainCount());
        
        return ResponseEntity.ok(stats);
    }
}