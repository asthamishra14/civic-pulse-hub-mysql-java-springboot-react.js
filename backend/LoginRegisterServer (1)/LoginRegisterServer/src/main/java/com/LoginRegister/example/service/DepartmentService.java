package com.LoginRegister.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.UsersRepo;
import com.LoginRegister.example.requests.LoginRequest;

@Service
public class DepartmentService {

    @Autowired
    private UsersRepo usersRepo;

    //  Register Department
    public Users addDepartment(Users departmentUser) {
        // check if already exists
        Users existingUser = usersRepo.findByEmail(departmentUser.getEmail());
        if (existingUser != null) {
            return null;
        }

        // assign role dynamically
        String deptName = departmentUser.getName().toUpperCase().replace(" ", "_");
        departmentUser.setRole("DEPARTMENT_" + deptName);

        return usersRepo.save(departmentUser);
    }

    //  Login Department (check role)
    public boolean loginDepartment(LoginRequest loginRequest) {
        Users user = usersRepo.findByEmailAndPassword(
                loginRequest.getUserId(),
                loginRequest.getPassword()
        );

        return user != null && user.getRole() != null && user.getRole().startsWith("DEPARTMENT");
    }
}

