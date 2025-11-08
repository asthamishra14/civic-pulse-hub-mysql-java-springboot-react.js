package com.LoginRegister.example.repository;
import com.LoginRegister.example.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepo extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByGrievanceId(String grievanceId);
    List<Complaint> findByAssignedDepartmentIgnoreCase(String departmentName);
}

