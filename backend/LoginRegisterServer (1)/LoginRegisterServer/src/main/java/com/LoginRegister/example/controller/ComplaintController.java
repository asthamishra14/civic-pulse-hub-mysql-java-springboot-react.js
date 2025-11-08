package com.LoginRegister.example.controller;

import com.LoginRegister.example.entity.Complaint;
import com.LoginRegister.example.service.ComplaintService;
import com.LoginRegister.example.service.ComplaintUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;


@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5175")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;
    @Autowired
    private ComplaintUpdateService complaintUpdateService;

    // Submit complaint with optional file upload
    @PostMapping("/submit")
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam String email,
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String location,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile media
    ) throws IOException {

        Complaint complaint = new Complaint();
        complaint.setEmail(email);
        complaint.setTitle(title);
        complaint.setCategory(category);
        complaint.setLocation(location);
        complaint.setDescription(description);

        // File upload handling - store only filename and set mediaPath to /uploads/<filename>
        if (media != null && !media.isEmpty()) {
            String uploadDir = "C:/uploads/";
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) uploadFolder.mkdirs();

            String filename = System.currentTimeMillis() + "_" + media.getOriginalFilename();
            String fullPath = uploadDir + filename;
            media.transferTo(new File(fullPath));

            // Save relative path for client consumption
            complaint.setMediaPath("/uploads/" + filename);
        }

        Complaint savedComplaint = complaintService.submitComplaint(complaint);
        return ResponseEntity.ok(savedComplaint);
    }

    // Track complaint using grievance ID
    @GetMapping("/track/{grievanceId}")
    public ResponseEntity<?> trackComplaint(@PathVariable String grievanceId) {
        Optional<Complaint> complaint = complaintService.trackComplaint(grievanceId);

        if (complaint.isPresent()) {
            return ResponseEntity.ok(complaint.get());
        } else {
            return ResponseEntity.status(404).body("Complaint not found");
        }
    }

    // Get all complaints (for Admin)
    @GetMapping("/all")
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    // Update status (Admin can mark as resolved/pending)
    @PutMapping("/{id}/status")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String comment) {

        Complaint complaint = complaintService.getComplaintById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if ("Resolved".equalsIgnoreCase(status)) {
            complaint.setFeedbackSubmitted(false);
            complaint.setUserFeedback(null);
            complaint.setStarRating(null);
        }

        complaint.setStatus(status);

        if (comment != null && !comment.isEmpty()) {
            complaint.setAdminComment(comment);
        }

        return complaintService.submitComplaint(complaint);
    }

    // Assign complaint to a department (Admin action)
    @PutMapping("/{id}/assign")
    public ResponseEntity<Complaint> assignComplaint(
            @PathVariable Long id,
            @RequestParam String department,
            @RequestParam(required = false) Integer resolutionDays) {
        Complaint complaint = complaintService.getComplaintById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAssignedDepartment(department);
        complaint.setStatus("Assigned to " + department);

        if (resolutionDays != null && resolutionDays > 0) {
            complaint.setResolutionDays(resolutionDays);
            complaint.setDueDate(java.time.LocalDate.now().plusDays(resolutionDays)); // calculate due date
        }

        String currentComment = complaint.getAdminComment();
        if (currentComment == null || currentComment.isEmpty()) {
            complaint.setAdminComment("Assigned to " + department + " by Admin");
        } else {
            complaint.setAdminComment(currentComment + " | Assigned to " + department + " by Admin");
        }

        Complaint updatedComplaint = complaintService.submitComplaint(complaint);
        return ResponseEntity.ok(updatedComplaint);
    }

    // Get complaints assigned to a particular department (Department view)
    @GetMapping("/department/{departmentName}")
    public List<Complaint> getComplaintsByDepartment(@PathVariable String departmentName) {
        return complaintService.getComplaintsByDepartment(departmentName);
    }

    // Department updates complaint (assign worker, mark resolved, upload photo, etc.)
    @PutMapping("/{id}/update-by-department")
    public Complaint updateByDepartment(
            @PathVariable Long id,
            @RequestParam(required = false) String workerName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String comment,
            @RequestParam(required = false) MultipartFile photo
    ) throws IOException {

        Complaint complaint = complaintService.getComplaintById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        // Assign worker if provided
        if (workerName != null && !workerName.isEmpty()) {
            complaint.setAssignedWorker(workerName);
        }

        // Update complaint status
        if (status != null && !status.isEmpty()) {
            complaint.setStatus(status);
            // set completion date when resolved
            if ("Resolved".equalsIgnoreCase(status)) {
                complaint.setCompletionDate(LocalDate.now());
            }
        }




        // Add comment by department
        if (comment != null && !comment.isEmpty()) {
            String currentComment = complaint.getAdminComment();
            complaint.setAdminComment(
                    (currentComment == null ? "" : currentComment + " | ") +
                            "Dept Update: " + comment
            );
        }

        // Handle proof photo upload - store only filename and set mediaPath = /uploads/<filename>
        String savedProofPath = null;
        if (photo != null && !photo.isEmpty()) {
            String uploadDir = "C:/uploads/";
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            String filePath = uploadDir + filename;
            photo.transferTo(new File(filePath));
            savedProofPath = "/uploads/" + filename;
            complaint.setDepartmentProofPath(savedProofPath);
        }

        // Save the complaint changes
        Complaint updatedComplaint = complaintService.submitComplaint(complaint);

        // Also create a ComplaintUpdate record for admin tracking (if you store updates)
        try {
            com.LoginRegister.example.entity.ComplaintUpdate update = new com.LoginRegister.example.entity.ComplaintUpdate();
            update.setComplaintId(updatedComplaint.getId());
            update.setDepartmentName(updatedComplaint.getAssignedDepartment());
            update.setStatus(updatedComplaint.getStatus());
            update.setComment(comment != null ? comment : "");
            update.setProofPath(savedProofPath);
            complaintUpdateService.saveUpdate(update);
        } catch (Exception ex) {
            System.err.println("Warning: failed to save complaint update record: " + ex.getMessage());
        }

        return updatedComplaint;
    }

    // ===== submit feedback =====
    @PutMapping("/{id}/feedback")
    public ResponseEntity<Complaint> submitFeedback(
            @PathVariable Long id,
            @RequestParam String feedback,
            @RequestParam Integer rating
    ) {
        Complaint updated = complaintService.saveFeedback(id, feedback, rating);
        return ResponseEntity.ok(updated);
    }
}
