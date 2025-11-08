package com.LoginRegister.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.UsersRepo;
import com.LoginRegister.example.requests.LoginRequest;

@Service
public class UserService {

    @Autowired
    UsersRepo usersRepo;

    public Users addUser(Users user) {
        return usersRepo.save(user);
    }

    public Boolean loginUser(LoginRequest loginRequest) {
        Users user = usersRepo.findByEmailAndPassword(loginRequest.getUserId(), loginRequest.getPassword());
        return user != null;
    }
}

