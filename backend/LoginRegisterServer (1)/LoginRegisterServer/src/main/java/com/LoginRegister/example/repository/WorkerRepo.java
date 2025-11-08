package com.LoginRegister.example.repository;

import com.LoginRegister.example.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkerRepo extends JpaRepository<Worker, Long> {
    List<Worker> findByDepartment(String department);
}
