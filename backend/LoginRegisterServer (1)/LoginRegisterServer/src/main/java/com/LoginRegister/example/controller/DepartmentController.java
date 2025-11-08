package com.LoginRegister.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.requests.LoginRequest;
import com.LoginRegister.example.repository.UsersRepo;

@RestController
@RequestMapping("/api/department")
@CrossOrigin(origins = "http://localhost:5175")
public class DepartmentController {

    @Autowired
    private UsersRepo usersRepo;

    @PostMapping("/login")
    public ResponseEntity<?> loginDepartment(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for department: " + loginRequest.getUserId());

        Users user = usersRepo.findByEmailAndPassword(
                loginRequest.getUserId(),  // this will match 'email' in your DB
                loginRequest.getPassword()
        );

        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid Department credentials");
        }

        // Check if the user role is a department (not admin or people)
        if (user.getRole() == null || user.getRole().equalsIgnoreCase("admin") || user.getRole().equalsIgnoreCase("people")) {
            return ResponseEntity.badRequest().body("Not a department account");
        }

        // Return department info
        return ResponseEntity.ok(user);
    }
}

