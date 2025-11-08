package com.LoginRegister.example.service;

import com.LoginRegister.example.entity.Complaint;
import com.LoginRegister.example.repository.ComplaintRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;


@Service
public class ComplaintService{

    @Autowired
    private ComplaintRepo complaintRepo;
    private Integer resolutionDays;

    //  Submit complaint (auto-generate Grievance ID only for new ones)
    public Complaint submitComplaint(Complaint complaint) {
        // Generate new grievance ID only if not already set
        if (complaint.getGrievanceId() == null || complaint.getGrievanceId().isEmpty()) {
            complaint.setGrievanceId("GRV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        return complaintRepo.save(complaint);
    }

    //  Track complaint by grievance ID
    public Optional<Complaint> trackComplaint(String grievanceId) {
        return complaintRepo.findByGrievanceId(grievanceId);
    }

    //  Fetch all complaints (Admin)
    public List<Complaint> getAllComplaints() {
        return complaintRepo.findAll();
    }

    //  Get by ID
    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepo.findById(id);
    }

    //  Update status and admin comment
    public Complaint updateStatus(Long id, String status, String comment) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);

        if (comment != null && !comment.isEmpty()) {
            String currentComment = complaint.getAdminComment();
            complaint.setAdminComment(
                    (currentComment == null ? "" : currentComment + " | ") + comment
            );
        }

        return complaintRepo.save(complaint);
    }

    //  Assign complaint to a department (Admin assigns)
    public Complaint assignComplaintToDepartment(Long complaintId, String department) {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAssignedDepartment(department);
        complaint.setStatus("Assigned to " + department);



        complaint.setResolutionDays(resolutionDays);
        if (resolutionDays != null && resolutionDays > 0) {
            complaint.setDueDate(LocalDate.now().plusDays(resolutionDays));
        }

        String currentComment = complaint.getAdminComment();
        complaint.setAdminComment(
                (currentComment == null ? "" : currentComment + " | ") +
                        "Assigned to " + department + " by Admin"
        );

        return complaintRepo.save(complaint);
    }

    //  Fetch all complaints for a specific department
    public List<Complaint> getComplaintsByDepartment(String departmentName) {
        return complaintRepo.findByAssignedDepartmentIgnoreCase(departmentName);
    }

    //  Department updates (worker assignment, status, proof, comment)
    public Complaint updateByDepartment(Long id, String workerName, String status, String comment, String mediaPath) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (workerName != null && !workerName.isEmpty()) {
            complaint.setAssignedWorker(workerName);
        }

        if (status != null && !status.isEmpty()) {
            //
            if ("Resolved".equalsIgnoreCase(status)) {
                complaint.setFeedbackSubmitted(false);
                complaint.setUserFeedback(null);
                complaint.setStarRating(null);
                //  Set completion date when resolved
                complaint.setCompletionDate(LocalDate.now());
            }

            // Optional: clear completion date if reopened or pending
            if ("Reopened".equalsIgnoreCase(status) || "Pending".equalsIgnoreCase(status)) {
                complaint.setCompletionDate(null);
            }

            complaint.setStatus(status);
        }

        if (comment != null && !comment.isEmpty()) {
            String currentComment = complaint.getAdminComment();
            complaint.setAdminComment(
                    (currentComment == null ? "" : currentComment + " | ") +
                            "Dept Update: " + comment
            );
        }

        if (mediaPath != null && !mediaPath.isEmpty()) {
            complaint.setMediaPath(mediaPath);
        }

        return complaintRepo.save(complaint);
    }

    // ===== save feedback from user =====
    public Complaint saveFeedback(Long id, String feedback, Integer rating) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setUserFeedback(feedback);
        complaint.setStarRating(rating);
        complaint.setFeedbackSubmitted(true);

        // If rating is 2 or less, reopen the complaint for reassignment
        if (rating != null && rating <= 2) {
            complaint.setStatus("Reopened");
            // optionally clear assigned worker so dept will reassign; keep department to allow admin to reassign
            complaint.setAssignedWorker(null);
        }

        return complaintRepo.save(complaint);
    }
}
