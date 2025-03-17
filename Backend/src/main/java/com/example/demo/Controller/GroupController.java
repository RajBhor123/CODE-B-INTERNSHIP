package com.example.demo.Controller;

//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.demo.Entity.Group;
//import com.example.demo.Services.GroupService;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/groups")
//@CrossOrigin(origins = "http://localhost:3000")
//public class GroupController {
//
//    @Autowired
//    private GroupService groupService;
//
//    @GetMapping
//    public List<Group> getAllGroups() {
//        return groupService.getAllGroups();
//    }
//
//    @GetMapping("/{id}")
//    public Optional<Group> getGroupById(@PathVariable Long id) {
//        return groupService.getGroupById(id);
//    }
//
//    @PostMapping
//    public Group createGroup(@RequestBody Group group) {
//        return groupService.addGroup(group);
//    }
//
//    @PutMapping("/{id}")
//    public Group updateGroup(@PathVariable Long id, @RequestBody String newName) {
//        return groupService.updateGroup(id, newName);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteGroup(@PathVariable Long id) {
//        groupService.softDeleteGroup(id);
//    }
//}

//package com.example.demo.Controller;

//import com.example.demo.Entity.Group;
//import com.example.demo.Services.GroupService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/groups")
//@CrossOrigin(origins = "*")
//public class GroupController {
//
//    @Autowired
//    private GroupService groupService;
//
//    @GetMapping
//    public List<Group> getAllGroups() {
//        return groupService.getAllGroups();
//    }
//
//    @PostMapping("/add")
//    public ResponseEntity<?> addGroup(@RequestBody Group group) {
//        try {
//            Group savedGroup = groupService.addGroup(group);
//            return ResponseEntity.ok(Map.of("message", "Group added successfully", "group", savedGroup));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @PutMapping("/update/{id}")
//    public ResponseEntity<?> updateGroup(@PathVariable Long id, @RequestBody Map<String, String> request) {
//        try {
//            String newName = request.get("groupName");
//            Group updatedGroup = groupService.updateGroup(id, newName);
//            return ResponseEntity.ok(Map.of("message", "Group updated successfully", "group", updatedGroup));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
//        try {
//            groupService.deleteGroup(id);
//            return ResponseEntity.ok(Map.of("message", "Group deactivated successfully"));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        }
//    }
//}

import com.example.demo.Entity.Group;
import com.example.demo.Services.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {
    @Autowired
    private GroupService groupService;
    
    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addGroup(@RequestBody Group group) {
        try {
            Group savedGroup = groupService.addGroup(group);
            return ResponseEntity.ok(Map.of("message", "Group added successfully", "group", savedGroup));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("groupName");
            Group updatedGroup = groupService.updateGroup(id, newName);
            return ResponseEntity.ok(Map.of("message", "Group updated successfully", "group", updatedGroup));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        try {
            groupService.deleteGroup(id);
            return ResponseEntity.ok(Map.of("message", "Group deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
