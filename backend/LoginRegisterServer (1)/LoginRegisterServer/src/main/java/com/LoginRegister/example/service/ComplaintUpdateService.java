package com.LoginRegister.example.service;

import com.LoginRegister.example.entity.ComplaintUpdate;
import com.LoginRegister.example.repository.ComplaintUpdateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintUpdateService {

    @Autowired
    private ComplaintUpdateRepo updateRepo;

    public ComplaintUpdate saveUpdate(ComplaintUpdate update) {
        return updateRepo.save(update);
    }

    public List<ComplaintUpdate> getUpdatesByComplaintId(Long complaintId) {
        return updateRepo.findByComplaintIdOrderByUpdatedAtAsc(complaintId);
    }
}
