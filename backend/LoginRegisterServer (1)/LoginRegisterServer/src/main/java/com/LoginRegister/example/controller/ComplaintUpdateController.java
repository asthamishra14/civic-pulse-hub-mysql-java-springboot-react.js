package com.LoginRegister.example.controller;

import com.LoginRegister.example.entity.ComplaintUpdate;
import com.LoginRegister.example.service.ComplaintUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaint-updates")
@CrossOrigin(origins = "http://localhost:5175")
public class ComplaintUpdateController {

    @Autowired
    private ComplaintUpdateService updateService;

    @PostMapping
    public ResponseEntity<ComplaintUpdate> createUpdate(@RequestBody ComplaintUpdate update) {
        return ResponseEntity.ok(updateService.saveUpdate(update));
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<List<ComplaintUpdate>> getUpdates(@PathVariable Long complaintId) {
        return ResponseEntity.ok(updateService.getUpdatesByComplaintId(complaintId));
    }
}
