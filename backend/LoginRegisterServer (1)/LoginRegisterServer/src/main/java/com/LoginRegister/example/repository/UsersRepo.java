package com.LoginRegister.example.repository;

import com.LoginRegister.example.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository<Users, String> {
    Users findByEmailAndPassword(String email, String password);
    Users findByEmail(String email);
}





