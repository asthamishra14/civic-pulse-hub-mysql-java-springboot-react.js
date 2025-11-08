package com.LoginRegister.example.repository;

import com.LoginRegister.example.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {
    Admin findByAdminId(String adminId);
}
