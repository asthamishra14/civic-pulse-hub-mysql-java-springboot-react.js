package com.LoginRegister.example;

import com.LoginRegister.example.entity.Admin;
import com.LoginRegister.example.repository.AdminRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LoginRegisterServerApplication {


	public static void main(String[] args) {
		SpringApplication.run(LoginRegisterServerApplication.class, args);
	}


	@Bean
		CommandLineRunner initAdmin(AdminRepo adminRepo) {
			return args -> {
				if (adminRepo.findByAdminId("admin@example.com") == null) {
					Admin defaultAdmin = new Admin();
					defaultAdmin.setAdminId("admin@example.com");
					defaultAdmin.setPassword("23214"); // Later replace with BCrypt
					defaultAdmin.setName("Super Admin");

					adminRepo.save(defaultAdmin); // ✅ Now works
					System.out.println("✔ Default admin created: admin@example.com / 23214");
				}
			};
		}

	}







