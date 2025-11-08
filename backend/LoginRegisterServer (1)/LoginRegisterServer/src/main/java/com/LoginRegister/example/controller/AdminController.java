package com.LoginRegister.example.controller;

import com.LoginRegister.example.entity.Admin;
import com.LoginRegister.example.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5175")  // React frontend port
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public String login(@RequestBody Admin loginRequest) {
        Admin admin = adminService.login(loginRequest.getAdminId(), loginRequest.getPassword());
        if (admin != null) {
            return "Login successful";
        }
        return "Invalid Admin ID or Password";
    }
}



