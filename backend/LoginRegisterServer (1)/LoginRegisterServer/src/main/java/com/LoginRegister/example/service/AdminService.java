package com.LoginRegister.example.service;

import com.LoginRegister.example.entity.Admin;
import com.LoginRegister.example.repository.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepository;

    public Admin login(String adminId, String password) {
        Admin admin = adminRepository.findByAdminId(adminId);
        if (admin != null && admin.getPassword().equals(password)) {
            return admin; // successful login
        }
        return null; // invalid login
    }
}
