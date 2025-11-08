package com.LoginRegister.example.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalDate;


@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String grievanceId;
    private String email;
    private String title;
    private String category;
    private String location;

    @Column(length = 2000)
    private String description;

    //  User uploaded image
    private String originalMediaPath;

    private String mediaPath; // path of uploaded file

    private LocalDateTime createdAt;

    private String status = "Pending";  // default status

    @Column(length = 2000)
    private String adminComment; // new field for admin feedback
    private String departmentProofPath;  // New field to store proof uploaded by department

    private String assignedDepartment;  // e.g., "EB", "Water"
    private String assignedWorker;


    @Column(length = 2000)
    private String userFeedback;       // feedback text from user

    private Integer starRating;        // 1..5

    private Boolean feedbackSubmitted = false; // default false




    private Integer resolutionDays;
    private LocalDate dueDate;
    private LocalDate completionDate;


    public Complaint() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGrievanceId() {
        return grievanceId;
    }

    public void setGrievanceId(String grievanceId) {
        this.grievanceId = grievanceId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMediaPath() {
        return mediaPath;
    }

    public void setMediaPath(String mediaPath) {
        this.mediaPath = mediaPath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminComment() {
        return adminComment;
    }
    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }
    public String getAssignedDepartment() {
        return assignedDepartment;
    }

    public void setAssignedDepartment(String assignedDepartment) {
        this.assignedDepartment = assignedDepartment;
    }

    public String getAssignedWorker() {
        return assignedWorker;
    }

    public void setAssignedWorker(String assignedWorker) {
        this.assignedWorker = assignedWorker;
    }
    public String getDepartmentProofPath() {
        return departmentProofPath;
    }

    public void setDepartmentProofPath(String departmentProofPath) {
        this.departmentProofPath = departmentProofPath;
    }


    public String getUserFeedback() {
        return userFeedback;
    }

    public void setUserFeedback(String userFeedback) {
        this.userFeedback = userFeedback;
    }

    public Integer getStarRating() {
        return starRating;
    }

    public void setStarRating(Integer starRating) {
        this.starRating = starRating;
    }

    public Boolean getFeedbackSubmitted() {
        return feedbackSubmitted;
    }

    public void setFeedbackSubmitted(Boolean feedbackSubmitted) {
        this.feedbackSubmitted = feedbackSubmitted;
    }


    public Integer getResolutionDays() {
        return resolutionDays;
    }

    public void setResolutionDays(Integer resolutionDays) {
        this.resolutionDays = resolutionDays;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

}
