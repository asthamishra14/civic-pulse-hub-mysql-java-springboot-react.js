package com.LoginRegister.example.controller;

import com.LoginRegister.example.entity.Worker;
import com.LoginRegister.example.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "http://localhost:5175")
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    @PostMapping("/add")
    public Worker addWorker(@RequestBody Worker worker) {
        return workerService.addWorker(worker);
    }

    @GetMapping("/{department}")
    public List<Worker> getWorkersByDepartment(@PathVariable String department) {
        return workerService.getWorkersByDepartment(department);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorker(@PathVariable Long id) {
        boolean deleted = workerService.deleteWorkerById(id);
        if (deleted) {
            return ResponseEntity.ok("Worker deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Worker not found");
        }
    }
}
