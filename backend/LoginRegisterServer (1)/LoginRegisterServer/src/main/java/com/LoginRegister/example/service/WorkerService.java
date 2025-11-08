package com.LoginRegister.example.service;

import com.LoginRegister.example.entity.Worker;
import com.LoginRegister.example.repository.WorkerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkerService {

    @Autowired
    private WorkerRepo workerRepository;



    public Worker addWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    public List<Worker> getWorkersByDepartment(String department) {
        return workerRepository.findByDepartment(department);
    }
    //  Delete worker by ID
    public boolean deleteWorkerById(Long id) {
        if (workerRepository.existsById(id)) {
            workerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
