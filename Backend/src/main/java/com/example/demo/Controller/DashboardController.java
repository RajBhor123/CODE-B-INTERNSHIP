package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Services.ChainService;
import com.example.demo.Services.GroupService;
import com.example.demo.Services.BrandService;
import com.example.demo.Services.ZoneService;
import com.example.demo.Services.EstimateService;

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

    @Autowired
    private BrandService brandService;

    @Autowired
    private ZoneService zoneService;

    @Autowired
    private EstimateService estimateService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalGroups", groupService.getGroupCount());
        stats.put("totalChains", chainService.getChainCount());
        stats.put("totalBrands", brandService.getBrandCount());
        stats.put("totalZones", zoneService.getZoneCount());
        stats.put("totalEstimates", estimateService.getEstimateCount());

        return ResponseEntity.ok(stats);
    }
}